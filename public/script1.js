let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
closeBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  menuBtnChange(); 
});
function menuBtnChange() {
  if (sidebar.classList.contains("open")) {
    closeBtn.classList.replace("bx-menu", "bx-menu-alt-right"); 
  } else {
    closeBtn.classList.replace("bx-menu-alt-right", "bx-menu"); 
  }
}
var inserted = document.getElementById('inserted').value;
var err = document.getElementById('err').value;
if (inserted == 'false') { 
      swal({
        title: "Error!",
        text: err,
        icon: "error",
        button: "OK"
    }).then((value) => {
      history.replaceState(null, null, '/students');
    });
   } 
   else if(inserted == 'true') { 
    swal({
        title: "Success!",
        text: "Student(s) inserted successfully",
        icon: "success",
        button: "OK"
    }).then((value) => {
      history.replaceState(null, null, '/students');
    });
   } 
   function showUploaded(){
    ifile = document.getElementById('studentExcelSheet').files[0];
    if(ifile){
      document.getElementById('uploadFile').innerHTML='<div class = "box-name" style="margin-top:4vh">File Uploaded<i class="bx bxs-checkbox-checked"></i></div><br><h6 class="box-name" style="text-align:center;font-size:10px;">click again to change file<h6>';
    }
    ifile = document.getElementById('resultExcelSheet2').files[0];
    if(ifile){
      document.getElementById('uploadFile2').innerHTML='<div class = "box-name" style="margin-top:4vh">File Uploaded<i class="bx bxs-checkbox-checked"></i></div><br><h6 class="box-name" style="text-align:center;font-size:10px;">click again to change file<h6>';
    }
   }