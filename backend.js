const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path = require('path');
const { createPool } = require('mysql');
const multer = require('multer');
const xlsx = require('xlsx');
const url = require('url');
const querystring = require('querystring');
const http = require('http');

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "results_db",
    connectionLimit: 10
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, ''));
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


function getlink(){
    const server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        const id = queryParams.id;
        const limit1 = queryParams.limit;
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`ID: ${id}`, `LIMIT: ${limit1}`);
    });
}
app.get('/login', (req, res) => {
    res.render('LoginPage');
});


app.get('/', (req, res) => {
    res.render('template1')
});

function toNum(num){
    if(num == "I"){return 1}
    if(num == "II"){return 2}
    if(num == "III"){return 3}
    if(num == "IV"){return 4}
    else{
        return 0;
    }
}
function toNum2(num){
    if ("regular".includes(num.toLowerCase())) {
        return 1;
    } else if ("supplementary".includes(num.toLowerCase())) {
        return 0;
    } else {
        return -1;
    }
}
app.get('/regulationData', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    pool.query(`SELECT COUNT(*) AS total FROM regulations WHERE reg_text LIKE '%${search}%'  ORDER BY results_date DESC`, (countErr, countResult) => {
        if (countErr) {
            console.error(countErr);
            return res.status(500).send("Cannot retrieve data from db");
        }
        const totalRecords = countResult[0].total;
    
        pool.query(`SELECT * FROM regulations WHERE reg_text LIKE '%${search}%' ORDER BY results_date DESC LIMIT ${limit} OFFSET ${offset}`, (err, result, _fields) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Cannot retrieve data from db");
            }
            const totalPages = Math.ceil(totalRecords / limit);
            const currentPage = page;
            const prevPage = currentPage > 1 ? currentPage - 1 : null;
            const nextPage = currentPage < totalPages ? currentPage + 1 : null;
            res.json({ regulations: result, currentPage, prevPage, nextPage, totalPages });
        });
})
})

app.get('/form', (req, res) => {
    getlink();
    const id = req.query.id;
    pool.query(`SELECT * FROM regulations WHERE link_id=?`, [id], (err, result, _fields) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving data from database');
        }
        res.render('template3', { regulations: result, id:id });
    });
});

app.post('/submit', (req, res) => {
    getlink();
    const id = req.query.id;
    const rollno = req.body.rollno;
    
    if (!rollno || !id) {
        return res.status(400).send('Roll number or ID is missing');
    }
    var result2 = null;
    pool.query(`SELECT * FROM regulations WHERE link_id=?`, [id], (err, result, _fields) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving data from database');
        }
        result2=result;
    });
    pool.query('SELECT student_name, roll_number FROM all_students WHERE roll_number = ?', [rollno], (err, result, _fields) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving data from database');
        }
        
        if (result.length === 0) {
            return res.status(404).redirect('form?id='+id+'&noresults=1');
        }
        
        pool.query('SELECT * FROM results WHERE regulation_id = ? and roll_number = ?', [id, rollno], (err, result1, _fields) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error retrieving data from database');
            }
            if(result1.length===0){
                res.redirect('/form?noresults=1&id='+id)
            }
            res.render('results', { results: result1, regulations:result2, name: result[0].student_name, rollno: rollno.toUpperCase() });
        });
    });
});


app.post('/validateUser', (req, res)=> {
    let user = req.body.facId||"";
    let pass = req.body.pass||"";
    if(user === "pass" && pass == "user"){
        console.log("lets-go");
        res.redirect('/dashboard')
    }
    else{
        
    }
})

app.get('/dashboard', (req, res)=>{
    pool.query('SELECT * from regulations ORDER BY results_date DESC LIMIT 15', (err, result, _fields) => {
        if(err){
            console.error(err);
            return res.status(500).send("Error retreiveing from Database");
        }
        res.render('dashboard', {regulations : result});
    });
});

app.get('/students', (req, res)=>{
    const inserted = req.query.inserted || '';
    const deleted = req.query.deleted||'';
    const updated = req.query.updated||'';
    const error = req.query.err || "Error Occured please try again later";
    res.render('students', {
        deleted, 
        updated, 
        inserted: inserted,
        err: error});
});
app.get('/studentData', (req, res) => {
    const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const offset = (page - 1) * limit;
const search = req.query.search || '';

const query = "SELECT * FROM all_students WHERE roll_number LIKE ? OR student_name LIKE ? LIMIT ? OFFSET ?";
const countQuery = "SELECT COUNT(*) AS total FROM all_students WHERE roll_number LIKE ? OR student_name LIKE ?";

pool.query(query, [`%${search}%`,`%${search}%`, limit, offset], (err, result, _fields) => {
    if (err) {
        console.error(err);
        return res.status(500).send("Cannot retrieve data from db");
    }
    pool.query(countQuery, [`%${search}%`, `%${search}%`], (countErr, countResult, _countFields) => {
        if (countErr) {
            console.error(countErr);
            return res.status(500).send("Cannot retrieve data from db");
        }
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);
        const currentPage = page;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;
        const nextPage = currentPage < totalPages ? currentPage + 1 : null;
        res.json({
            students: result,
            limit: limit,
            search: search,
            prevPage,
            nextPage,
            currentPage,
            totalPages
        });
    });
});
});

app.post('/deleteRows', (req, res) => {
    const selectedRows = req.body.selectedRows; 
    const query = `DELETE FROM all_students WHERE roll_number IN (?)`; 

    pool.query(query, [selectedRows], (err, result) => {
    if (err) {
        console.error('Error deleting rows:', err);
        res.status(500).send('Error deleting rows');
    } else {
        console.log('Rows deleted successfully:', result);
        res.sendStatus(200); 
    }
    });
  });

app.get('/regulations', (req, res) => {
    const deleted = req.query.deleted || '';
    const error = req.query.err || "Error occured please try agian later";
    const updated = req.query.updated||'';
    res.render('regulations', {deleted, err:error, updated})
});

app.get('/regulationData', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    pool.query(`SELECT COUNT(*) AS total FROM regulations WHERE reg_text LIKE '%${search}%'`, (countErr, countResult) => {
        if (countErr) {
            console.error(countErr);
            return res.status(500).send("Cannot retrieve data from db");
        }
        const totalRecords = countResult[0].total;
    
        pool.query(`SELECT * FROM regulations WHERE reg_text LIKE '%${search}%' ORDER BY results_date DESC LIMIT ${limit} OFFSET ${offset}`, (err, result, _fields) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Cannot retrieve data from db");
            }
            const totalPages = Math.ceil(totalRecords / limit);
            const currentPage = page;
            const prevPage = currentPage > 1 ? currentPage - 1 : null;
            const nextPage = currentPage < totalPages ? currentPage + 1 : null;
            res.json({ regulations: result, currentPage, prevPage, nextPage, totalPages });
        });
})
})
app.get('/deleteExam', (req, res)=>{
    id = req.query.id;
    pool.query("DELETE FROM regulations WHERE link_id=?", [id], (err, result, _fields) => {
        if(err){
            res.redirect('regulations?deleted=false&err='+err);
        }
        else{
            pool.query("DELETE FROM results WHERE regulation_id= ?", [id], (err2, result2, _fields) => {
                if(err2){
                res.redirect('regulations?deleted=false&err='+ err2);
                }
                else{
                    res.redirect('regulations?deleted=true');
                }
            })
        }
    })
})
app.post('/deleteExams', (req, res) => {
    const selectedRows = req.body.selectedRows; 
    const query = `DELETE FROM regulations WHERE link_id IN (?)`; 

    pool.query(query, [selectedRows], (err, result) => {
    if (err) {
        console.error('Error deleting rows:', err);
        res.status(500).send('Error deleting rows');
    } else {
        pool.query("DELETE FROM results WHERE regulation_id IN (?)", [selectedRows], (err2, result2, _fields) => {
            if (err2) {
                console.error('Error deleting rows:', err2);
                res.status(500).send('Error deleting rows');
            } else {
                console.log('Rows deleted successfully:', result2);
                res.sendStatus(200); 
            }
        }) 
    }
    });
  });



app.get('/AdminResults', async (req, res) => {
    const inserted = req.query.inserted||'';
    const deleted = req.query.deleted || '';
    var error = req.query.err||"Cannot Insert Results Check For duplicate entries";
    const updated = req.query.updated||'';
    res.render('all_results', {inserted, err:error, deleted, updated})
    
});
app.get('/getResults', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    try {
        const counts = await new Promise((resolve, reject) => {
            pool.query("SELECT regulation_id, COUNT(*) AS row_count FROM results WHERE roll_number LIKE ? GROUP BY regulation_id ORDER BY regulation_id ASC LIMIT ? OFFSET ?", [`%${search}%`, limit, offset], (err, result, _fields) => {
                if (err) {
                    console.error(err);
                    reject("Cannot retrieve data from db");
                } else {
                    resolve(result);
                }
            });
        });
        const all_regulations = await new Promise((resolve, reject) => {
            pool.query("SELECT * FROM regulations", (err, result, _fields) => {
                if (err) {
                    console.error(err);
                    reject("Cannot retrieve data from db");
                } else {
                    resolve(result);
                }
            });
        })
        const counts2 = await new Promise((resolve, reject) => {
            pool.query("SELECT regulation_id, COUNT(*) AS row_count FROM results WHERE roll_number LIKE ? GROUP BY regulation_id ORDER BY regulation_id ASC", [`%${search}%`], (err, all_regs, _fields) => {
                if (err) {
                    console.error(err);
                    reject("Cannot retrieve data from db");
                } else {
                    resolve(all_regs);
                }
            });
        });

        const fetchResultsPromises = counts.map(regulation => {
            return new Promise((resolve, reject) => {
                pool.query(`SELECT * FROM results WHERE regulation_id = ? AND roll_number LIKE '%${search}%' ORDER BY regulation_id ASC`, [regulation.regulation_id], (err, result, _fields) => {
                    if (err) {
                        console.error(err);
                        reject("Cannot retrieve results");
                    } else {
                        resolve(result);
                    }
                });
            });
        });

        const regResults = await Promise.all(fetchResultsPromises);

        const regulationPromises = counts.map(regulation => {
            return new Promise((resolve, reject) => {
                pool.query("SELECT * FROM regulations WHERE link_id = ?", [regulation.regulation_id], (err, result, _fields) => {
                    if (err) {
                        console.error(err);
                        reject("Cannot retrieve regulation data");
                    } else {
                        resolve(result);
                    }
                });
            });
        });

        const regulations = await Promise.all(regulationPromises);
        const totalRecords = counts2.length;
        const totalPages = Math.ceil(totalRecords / limit);
        const currentPage = page;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;
        const nextPage = currentPage < totalPages ? currentPage + 1 : null;
        console.log(currentPage)
        console.log(totalPages)
        console.log(totalRecords)

        res.json( { counts: counts, regResults: regResults, regulations: regulations, currentPage, nextPage, totalPages, prevPage, all_regulations });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Cannot retrieve data from db");
    }
})

app.get('/deleteResult', (req, res) => {
    id = req.query.id;
    pool.query("DELETE FROM results WHERE id = ?", [id], (err, result, _fields) =>{
        if(err){
            res.redirect('AdminResults?deleted=false&err='+err);
        }
        else{
            res.redirect('AdminResults?deleted=true')
        }
    })
})

function computeSem(a, b) {
    if (a === 1 && b === 1) {
        return 1;
    } else if (a === 1 && b === 2) {
        return 2;
    } else if (a === 2 && b === 1) {
        return 3;
    } else if (a === 2 && b === 2) {
        return 4;
    } else if (a === 3 && b === 1) {
        return 5;
    } else if (a === 3 && b === 2) {
        return 6;
    } else if (a === 4 && b === 1) {
        return 7;
    } else if (a === 4 && b === 2) {
        return 8;
    } else {
        return -1; 
    }
}

app.get('/backlogs', (req, res) => {
    res.render('backlogs');
});
app.get('/getBacklogs', async (req, res) => {
    let search = req.query.search || '';
    let limit = parseInt(req.query.limit)||10;
    let page = parseInt(req.query.page)||1;
    const offset = (page - 1) * limit;


    try {
        const fail = "FAIL";
        const result = await new Promise((resolve, reject) => {
            pool.query("SELECT roll_number, regulation_id FROM results WHERE pass_or_fail = ? AND reg_or_sup = 1 AND roll_number IN (SELECT roll_number FROM all_students WHERE roll_number LIKE ? OR branch LIKE ? OR student_name LIKE ?)  ORDER BY regulation_id ASC", [fail, '%' + search + '%', '%' + search + '%', '%' + search + '%'], (err, result, _fields) => {
                if (err) {
                    reject("Cannot retrieve data:" + err);
                }
                resolve(result);
            });
        });

        const result2 = await new Promise((resolve, reject) => {
            pool.query("SELECT roll_number, regulation_id FROM results WHERE pass_or_fail = ? AND reg_or_sup=? AND roll_number  IN (SELECT roll_number FROM all_students WHERE roll_number LIKE ? OR branch LIKE ? OR student_name LIKE ?)  ORDER BY regulation_id ASC", ['PASS', 0,  '%' + search + '%', '%' + search + '%', '%' + search + '%'], (err, result2, _fields) => {
                if (err) {
                    reject("Cannot retrieve data:" + err);
                }
                resolve(result2);
            });
        });

        const getFailCountForRegulation = async (pool, regulationID, roll_no) => {
            try {
                const failCount = await new Promise((resolve, reject) => {
                    pool.query("SELECT COUNT(*) AS fail_count FROM results WHERE pass_or_fail = 'FAIL' AND regulation_id = ? AND roll_number = ?", [regulationID, roll_no], (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        const failCount = result[0].fail_count;
                        resolve(failCount);
                    });
                });
                return failCount;
            } catch (error) {
                console.error("Error:", error);
                return -1;
            }
        };

        const getPassCountForRegulation = async (pool, regulationID, roll_no) => {
            try {
                const passCount = await new Promise((resolve, reject) => {
                    pool.query("SELECT COUNT(*) AS pass_count FROM results WHERE pass_or_fail = 'PASS' AND roll_number = ? AND reg_or_sup = 0 GROUP BY regulation_id", [roll_no, regulationID], (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        const passCount = result[0].pass_count;
                        resolve(passCount);
                    });
                });
                return passCount;
            } catch (error) {
                console.error("Error:", error);
                return -1;
            }
        };

        const getRegulationIDs = (rollNumber, data) => {
            const regulationIDs = [];
            for (const entry of data) {
                if (entry.roll_number === rollNumber) {
                    regulationIDs.push(entry.regulation_id);
                }
            }
            return [...new Set(regulationIDs)];
        };

        const backlogRollNumbers = [...new Set(result.map(obj => obj.roll_number))];
        const backlogPassNumbers = [...new Set(result2.map(obj => obj.roll_number))];
        let backlogCounts = [];
        let backlogPassCounts = [];
        let backlogSems = [];
        let PassSems = [];

        for (const rollNumber of backlogRollNumbers) {
            let regulationIDs = getRegulationIDs(rollNumber, result);
            regulationIDs = [...new Set(regulationIDs)];

            backlogCounts.push(await Promise.all(regulationIDs.map(async (regulationID) => {
                return getFailCountForRegulation(pool, regulationID, rollNumber);
            })));

            let passRegulationIDs = getRegulationIDs(rollNumber, result2);
            passRegulationIDs = [...new Set(passRegulationIDs)];

            backlogPassCounts.push(await Promise.all(passRegulationIDs.map(async (regulationID) => {
                return getPassCountForRegulation(pool, regulationID, rollNumber);
            })));

            const backlogRegulationSemsPromises = regulationIDs.map(async (regulationID) => {
                try {
                    const regulations = await new Promise((resolve, reject) => {
                        pool.query("SELECT * FROM regulations WHERE link_id=?", [regulationID], (err, regulations, _fields) => {
                            if (err) {
                                reject("Cannot retrieve year and sem");
                            }
                            resolve(regulations);
                        });
                    });
                    const semesters = regulations.map(backlogRegulation => {
                        return computeSem(backlogRegulation.academic_year, backlogRegulation.academic_sem);
                    });
                    return semesters;
                } catch (error) {
                    console.error("Error:", error);
                    return [];
                }
            });

            const backlogPassSemsPromises = passRegulationIDs.map(async (regulationID) => {
                try {
                    const regulations = await new Promise((resolve, reject) => {
                        pool.query("SELECT * FROM regulations WHERE link_id = ?", [regulationID], (err, regulations, _fields) => {
                            if (err) {
                                reject("Cannot retrieve year and sem");
                            }
                            resolve(regulations);
                        });
                    });
                    const semesters = regulations.map(backlogPassRegulation => {
                        return computeSem(backlogPassRegulation.academic_year, backlogPassRegulation.academic_sem);
                    });
                    return semesters;
                } catch (error) {
                    console.error("Error:", error);
                    return [];
                }
            });

            const backlogRegulationSemsArray = await Promise.all(backlogRegulationSemsPromises);
            const backlogPassSemsArray = await Promise.all(backlogPassSemsPromises);

            backlogSems.push(backlogRegulationSemsArray.flat());
            PassSems.push(backlogPassSemsArray.flat());
        }
        

        res.json({
            backlogs: result,
            rolls: backlogRollNumbers,
            backlogSems: backlogSems,
            backlogCounts: backlogCounts,
            backlogPassCounts: backlogPassCounts,
            result2: PassSems,
            backlogPassNumbers: backlogPassNumbers,
            search
        });
    } catch (error) {
        res.status(500).send(error);
    }
});




    app.get('/studentPerformance', async (req, res)=>{
        const rollNo = req.query.roll_no;
        try {
            const counts = await new Promise((resolve, reject) => {
                pool.query("SELECT regulation_id, COUNT(*) AS row_count FROM results WHERE roll_number=? GROUP BY regulation_id ORDER BY regulation_id ASC", [rollNo],  (err, result, _fields) => {
                    if (err) {
                        console.error(err);
                        reject("Cannot retrieve data from db");
                    } else {
                        resolve(result);
                    }
                });
            });
    
            const fetchResultsPromises = counts.map(regulation => {
                return new Promise((resolve, reject) => {
                    pool.query("SELECT * FROM results WHERE regulation_id = ? AND roll_number = ? ORDER BY regulation_id ASC", [regulation.regulation_id, rollNo], (err, result, _fields) => {
                        if (err) {
                            console.error(err);
                            reject("Cannot retrieve results");
                        } else {
                            resolve(result);
                        }
                    });
                });
            });
    
            const regResults = await Promise.all(fetchResultsPromises);
    
            const regulationPromises = counts.map(regulation => {
                return new Promise((resolve, reject) => {
                    pool.query("SELECT * FROM regulations WHERE link_id = ?", [regulation.regulation_id], (err, result, _fields) => {
                        if (err) {
                            console.error(err);
                            reject("Cannot retrieve regulation data");
                        } else {
                            resolve(result);
                        }
                    });
                });
            });
    
            const regulations = await Promise.all(regulationPromises);
    
            pool.query("SELECT * FROM all_students WHERE roll_number = ?", [rollNo], (err, allStudentsResult, _fields) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Cannot retrieve data from all_students table");
                } else {
                    console.log(regulations)
                    res.render('studentPerformance', { counts: counts, regResults: regResults, regulations: regulations, allStudentsResult: allStudentsResult });
                }
            });
    
        } catch (error) {
            console.error(error);
            return res.status(500).send("Cannot retrieve data from db");
        }
    });
    
    app.post('/addStudent', (req, res) => {
        var studentName = req.body.newStudentName;
        var studentRollNo = req.body.newRollNumber;
        var branch = req.body.newBranch;
        var joinYear = req.body.newJoiningYear;
        var AdmissionCategory = req.body.adcat;
        var Eamcet = req.body.eamcet;
        var Gender = req.body.gender;
        var dob = req.body.dob;
        
        insertStudent(studentRollNo.toUppercase(), studentName, branch, joinYear, AdmissionCategory, Eamcet, Gender, dob, (err) => {
            if (err) {
                console.error('Error inserting student:', err);
                res.redirect('/students?inserted=false&err='+err);
            } else {
                console.log(`Student Name: ${studentName}, Roll Number: ${studentRollNo}, Branch: ${branch},`);
                res.redirect('/students?inserted=true');
            }
        });
    });
    app.get('/deleteStudent', (req, res) => {
        rollNo = req.query.id;
        pool.query("DELETE FROM all_students WHERE roll_number = ?", [rollNo], (err, result, _fields) => {
            if(err){
                console.error('Error deleting student:', err);
                res.redirect('/students?deleted=false&err='+err);
            }
            else {
                res.redirect('/students?deleted=true');
            }
        })
    });
    
    function insertStudent(rollNo, name, branch, joinYear, AdmissionCategory, Eamcet, Gender, dob, callback) {
        pool.query("INSERT INTO all_students (student_name, roll_number, branch, AY_admitted, admission_category, eamcet_number, gender, dob ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [name, rollNo, branch, joinYear, AdmissionCategory, Eamcet, Gender, dob], (err, result, _fields) => {
                if (err) {
                    console.error("Error inserting student:", err);
                    callback(err);
                } else {
                    console.log("Student Inserted");
                    callback(null);
                }
            }
        );
    }

    
    const moment = require('moment');
    app.post('/addStudents', (req, res) => {
        let responseSent = false; 
    
        const storage = multer.diskStorage({
            destination: './uploads/',
            filename: function(req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        });
        const upload = multer({
            storage: storage,
            limits: { fileSize: 1000000 }
        }).single('studentExcelSheet');
    
        upload(req, res, (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(500).send('Error uploading file');
            }
    
            console.log('File uploaded successfully');
            const filePath = req.file.path;
    
            try {
                const workbook = xlsx.readFile(filePath);
                const sheetName = workbook.SheetNames[0]; 
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = xlsx.utils.sheet_to_json(worksheet);
                const sql = 'INSERT INTO all_students (roll_number, student_name, AY_admitted, branch, admission_category, eamcet_number, gender, dob) VALUES ?';
                const values = jsonData.map(row => {
                    const dobDate = xlsx.SSF.parse_date_code(row.dob);
                    const formattedDOB = moment(dobDate.y + '-' + dobDate.m + '-' + dobDate.d, 'YYYY-M-D').format('YYYY-MM-DD');
                
                    return [row.roll_number, row.student_name, row.AY_admitted, row.branch, row.admission_category, row.eamcet_number, row.gender, formattedDOB];
                });
                pool.query(sql, [values], (err, results) => {
                    if (err) {
                        console.error('Error inserting data into MySQL:', err);
                        if (!responseSent) {
                            responseSent = true;
                            res.redirect('/students?inserted=false&err=' + err);
                        }
                    } else {
                        console.log('Data inserted into MySQL successfully');
                        if (!responseSent) {
                            responseSent = true;
                            res.redirect('/students?inserted=true');
                        }
                    }
                });
            } catch (error) {
                console.error('Error processing file:', error);
                if (!responseSent) {
                    responseSent = true;
                    return res.status(500).send('Error processing file');
                }
            }
        });
    });
    app.use((req, res, next) => {
        console.log(req.body);
        next();
    });
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/'); // Destination folder for uploaded files
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname); // Use original filename for the uploaded file
        }
    });
    
    const upload = multer({ storage: storage });
    
    app.post('/addResults', upload.single('resultExcelSheet'), (req, res) => {
        const academicYear = req.body.newAcademicYear;
        const academicSemester = req.body.newAcademicSem;
        const monthOfExam = req.body.newMonthOfExam;
        const yearOfExam = req.body.newYearOfExam;
        const regOrSup = req.body.newRegOrSupp;
        const Regulation = req.body.newRegulation;
        
        const today = new Date();
        const link_id = `${academicYear}${academicSemester}${regOrSup}${Regulation}${monthOfExam.substring(0, 3)}${yearOfExam}`;
        const reg_text = `${toRoman(academicYear)} Year ${toRoman(academicSemester)} Semester (${Regulation}) ${regSep(regOrSup)} Examinations, ${monthOfExam} ${yearOfExam}`;

            pool.query("INSERT INTO regulations (link_id, academic_year, academic_sem, regulation, reg_or_sup, exam_month, exam_year, results_date, reg_text) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [link_id, academicYear, academicSemester, Regulation, regOrSup, monthOfExam, yearOfExam, today, reg_text], (err, result) => {
                    if (err) {
                        console.error('Error inserting regulation:', err);
                        return res.status(500).send("Cannot Create Regulation: " + err);
                    }
                    console.log('Regulation inserted Successfully');
                    readAndInsertResults(req.file.path, link_id, res);
                });
        
    });
    
    app.post('/addToResults', upload.single('resultExcelSheet2'), (req, res) => {
        const link_id = req.body.existingRegulation;
            readAndInsertResults(req.file.path, link_id, res);
    });
    
    function readAndInsertResults(filePath, regulation_id, res) {
        let responseSent = false;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; 
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);
        const values = jsonData.map(row => [regulation_id, row.roll_number, row.subject_code, row.subject_name, row.internal_marks, row.external_marks, row.total_marks, row.grade, row.credits, row.pass_or_fail, row.roll_number+row.subject_code+regulation_id, row.reg_or_sup]);
    
        const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(',');
    
        const query = `INSERT INTO results (regulation_id, roll_number, subject_code, subject_name, internal_marks, external_marks, total_marks, grade, credits, pass_or_fail, id, reg_or_sup) VALUES ${placeholders}`;
        const flattenedValues = values.flat();
    
        pool.query(query, flattenedValues, (err, result) => {
            if (err) {
                console.error('Error inserting data into MySQL:', err);
                if (!responseSent) {
                    responseSent = true;
                    res.redirect('/AdminResults?inserted=false&err=' + err);
                }
            } else {
                console.log('Data inserted into MySQL successfully');
                if (!responseSent) {
                    responseSent = true;
                    res.redirect('/AdminResults?inserted=true');
                }
            }
        });
    }
    
// ALL UPDATIONS
// Student Update
app.post('/updateStudent', (req, res) => {
    ed_roll = req.body.editRollNumber;
    ed_name = req.body.editStudentName;
    branch_ = req.body.editBranch;
    ed_year = req.body.editJoiningYear;
    ad_cat  = req.body.editadcat;
    eamcet  = req.body.editeamcet;
    gender  = req.body.editgender;
    dob     = req.body.editdob;
    edit_id = req.body.rollID;

    let dobDate = new Date(dob);
    let formattedDOB = dobDate.toISOString().slice(0, 10);

    pool.query("UPDATE all_students SET student_name=?, branch=?, AY_admitted=?, roll_number=?, admission_category=?, eamcet_number=?, gender=?, dob=? WHERE roll_number = ?", [ ed_name, branch_, ed_year, ed_roll, ad_cat, eamcet, gender, formattedDOB, edit_id], (err, result, _fields) => {
        if (err) {
            res.redirect('/students?inserted=false&err=' + encodeURIComponent(err.message));
        } else {
            res.redirect('/students?updated=true');
        }
    });
});



//Regulation Update
app.post('/updateRegulation', (req, res) => {
    ed_roll = req.body.editRollNumber;
    ed_name = req.body.editStudentName;
    branch_ = req.body.editBranch;
    ed_year = req.body.editJoiningYear;
    e_month = req.body.editMonth;
    ex_year = req.body.editYear
    edit_id = req.body.id;
    new_reg = `${ed_roll}${ed_name}${ed_year}${branch_}${e_month.substring(0, 3)}${ex_year}`;
    reg_text = `${toRoman(ed_roll)} Year ${toRoman(ed_name)} Semester (${branch_}) ${regSep(ed_year)} Examinations, ${e_month} ${ex_year}`;

    pool.query("UPDATE regulations SET academic_year=?, academic_sem=?, regulation=?, reg_or_sup=?, exam_month=?, exam_year=?, reg_text=?, link_id=? WHERE link_id = ?", [ed_roll, ed_name, branch_, ed_year, e_month, ex_year, reg_text, new_reg, edit_id], (err, result, _fields) => {
        if (err) {
            res.redirect('/regulations?deleted=false&err=' + encodeURIComponent(err.message));
        } else {
            console.log(edit_id+"---"+new_reg)
            pool.query("UPDATE results SET regulation_id = ? WHERE regulation_id = ?", [new_reg, edit_id], (err2, result2, _fields) => {
                if (err2) {
                    res.redirect('/regulations?deleted=false&err=' + encodeURIComponent(err2.message));
                } else {
                    pool.query("UPDATE results SET id = CONCAT(roll_number, subject_code, regulation_id) WHERE regulation_id = ?", [new_reg], (err3, result3, _fields) => {
                        if (err3) {
                            res.redirect('/regulations?deleted=false&err=' + encodeURIComponent(err3.message));
                        } else {
                            res.redirect('/regulations?updated=true');
                        }
                    });
                }
            });
        }
    });
    
    
});
app.post('/updateResult', (req, res) => {
    rNum = req.body.rNum
    sCode = req.body.sCode
    sName = req.body.sName
    int_M = req.body.int_M
    ext_M = req.body.ext_M
    tot_M = req.body.tot_M
    credits = req.body.credits
    grade = req.body.grade
    pof = req.body.pof
    id = req.body.id

    pool.query("UPDATE results SET roll_number=?, subject_code=?, subject_name=?, internal_marks=?, external_marks=?, total_marks=?, credits=?, grade=?, pass_or_fail=? WHERE id = ?", [ rNum, sCode, sName, int_M, ext_M, tot_M, credits, grade, pof, id], (err, result, _fields) => {
        if (err) {
            res.redirect('/AdminResults?deleted=false&err=' + encodeURIComponent(err.message));
        } else {
            res.redirect('/AdminResults?updated=true');
        }
    });
    
});

function toRoman(num) {
    const romanNumeralMap = {
        1: 'I',
        2: 'II',
        3: 'III',
        4: 'IV'
    };

    return romanNumeralMap[num];
}
function regSep(reg_or_sup) {
    return reg_or_sup ? 'Regular/Supplementary' : 'Supplementary';
}

app.get("/getScores", async (req, res) => {
    try {
        const searchQuery = req.query.search || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const offset = (page - 1) * limit;

        const rollNumberQuery = "SELECT DISTINCT roll_number FROM results WHERE roll_number IN (SELECT roll_number FROM all_students WHERE roll_number LIKE ? OR branch LIKE ?) LIMIT ? OFFSET ?";
        const rollNumbers = await new Promise((resolve, reject) => {
            pool.query(rollNumberQuery, [`%${searchQuery}%`, `%${searchQuery}%`, limit, offset], (err, result, _fields) => {
                if (err) {
                    console.error("Error querying database for roll numbers:", err);
                    reject(err);
                } else {
                    resolve(result.map(row => row.roll_number));
                }
            });
        });

        const rollNumberQuery2 = "SELECT DISTINCT roll_number FROM results WHERE roll_number IN (SELECT roll_number FROM all_students WHERE roll_number LIKE ? OR branch LIKE ?)";
        const rollNumbersCounts = await new Promise((resolve, reject) => {
            pool.query(rollNumberQuery2, [`%${searchQuery}%`, `%${searchQuery}%`], (err, result, _fields) => {
                if (err) {
                    console.error("Error querying database for roll numbers:", err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        })

        const maxMarksPromises = rollNumbers.map(rollNo => new Promise((resolve, reject) => {
            pool.query(
                "SELECT subject_code, MAX(total_marks) as max_marks FROM results WHERE roll_number = ? GROUP BY subject_code",
                [rollNo],
                (err, result, _fields) => {
                    if (err) {
                        console.error("Error querying database for max marks:", err);
                        reject(err);
                    } else {
                        resolve({ rollNo, result });
                    }
                }
            );
        }));

        const failCountPromises = rollNumbers.map(rollNo => new Promise((resolve, reject) => {
            pool.query(
                "SELECT COUNT(*) as fail_count FROM results WHERE roll_number = ? AND pass_or_fail = 'FAIL' AND reg_or_sup = 1",
                [rollNo],
                (err, result, _fields) => {
                    if (err) {
                        console.error("Error querying database for fail count:", err);
                        reject(err);
                    } else {
                        resolve({ [rollNo] : result[0].fail_count });
                    }
                }
            );
        }));

        const passCountPromises = rollNumbers.map(rollNo => new Promise((resolve, reject) => {
            pool.query(
                "SELECT COUNT(*) as pass_count FROM results WHERE roll_number = ? AND pass_or_fail = 'PASS' AND reg_or_sup = 0",
                [rollNo],
                (err, result, _fields) => {
                    if (err) {
                        console.error("Error querying database for pass count:", err);
                        reject(err);
                    } else {
                        resolve({ [rollNo]: result[0].pass_count });
                    }
                }
            );
        }));
        
        const [maxMarks, backlogRolls1, passRolls1, Fcount] = await Promise.all([
            Promise.all(maxMarksPromises),
            Promise.all(failCountPromises),
            Promise.all(passCountPromises), 
            Promise.all(rollNumbersCounts)
        ]);
        let passRolls = {}
        passRolls1.forEach(dict => {
            for (const key in dict) {
                passRolls[key] = dict[key];
            }
        });
        let backlogRolls = {}
        backlogRolls1.forEach(dict => {
            for (const key in dict) {
                backlogRolls[key] = dict[key];
            }
        });

        const totalRecords = Fcount.length;
        const totalPages = Math.ceil(totalRecords / limit);
        const currentPage = page;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;
        const nextPage = currentPage < totalPages ? currentPage + 1 : null;

        res.json({
            maxMarks,
            rollNumbers,
            backlogRolls,
            passRolls,
            totalPages,
            currentPage,
            prevPage,
            nextPage
        });
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.get("/scores", (req, res) => {
    res.render('scores');
})
app.listen(port, () => {
    console.log('Server Running @ port'+port);
});