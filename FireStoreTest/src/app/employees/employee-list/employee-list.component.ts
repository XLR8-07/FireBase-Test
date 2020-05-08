import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import { Employee } from 'src/app/shared/employee.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Routine } from 'src/app/shared/routine.model';
import { getTranslationDeclStmts } from '@angular/compiler/src/render3/view/template';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { EmployeeComponent } from '../employee/employee.component';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  list: Employee[];
  //blocks : Routine[];
  Routines: Routine[];
  slots: Routine[];
  arrTue: Routine[][];
  num: number[] = [1,2,3,4,5,6];
  num2: number[] = [1];
  dayRoutine : Routine [] = [];
  sortedRoutine : Routine [] = [];
  counter = 0;
  
  WED : Routine [];
  c : number =0;



  constructor(public service: EmployeeService, private firestore: AngularFirestore, private toastr: ToastrService
    , private dialog : MatDialog) {
     }
  ngOnInit(): void {
    this.service.getEmployees().subscribe(actionArray2 => {
      this.list = actionArray2.map(item2 => {
        return {
          id: item2.payload.doc.id,
          ...item2.payload.doc.data() as Employee
        } as Employee;
      })
    });    
  }

  refreshRoutine(){
    this.service.getRoutines().subscribe(actionArray3 => {
      this.service.blocks = actionArray3.map(item3 => {
        return {
          id: item3.payload.doc.id,
          ...item3.payload.doc.data() as Routine
        } as Routine;
      });
    });
    this.service.onSubmit();
    
  }

  /*onEdit(emp:Employee){
    //this.service.formData = Object.assign({},emp);
    this.service.formData = emp;
    
  }*/

  onEdit(routine: Routine) {
    this.service.routineFormData = routine;
    console.log(this.service.routineFormData.id);
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = false;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "50%";
    this.service.inputRoutineForm.setValue(routine);
    this.service.f_ACBUIL = routine.ACBUIL;
    this.service.getRoomacrdBuil(this.service.f_ACBUIL);
    this.dialog.open(EmployeeComponent,dialogconfig);
    // this.service.getRoomacrdBuil(routine.ACBUIL);
    // this.service.routineFormData = routine;
    //this.service.routineFormData = Object.assign({},routine);
  }

  onDelete(id: string) {
    if (confirm("ARE YOU SURE TO DELETE?")) {
      this.firestore.doc('Routine/' + id).delete().then(()=> {
        this.service.onSubmit();
      });
      console.log('clicked delete');

      this.toastr.warning("DELETED SUCCESSFULLY!!", "Registration");
    }
  }

  setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
  }

  btn_add(Day : string){
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = false;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "50%";
    this.service.getRoomacrdBuil(1);
    this.service.inputRoutineForm.reset();
    this.service.f_ACBUIL = null ;
    this.service.setDay(Day);
    this.dialog.open(PopUpComponent,dialogconfig);
  }

  

}



