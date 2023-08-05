import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm } from "@angular/forms";
import {
  ResolveEnd,
  ResolveStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
} from "@angular/router";
import { CacheService } from "src/app/shared/services/cache-service";
// import { UpiService } from 'src/app/shared/services/upi.service';
import { ResponseInterface } from 'src/app/shared/interface';
import { environment } from "src/environments/environment";
import { Customer } from '../../store/customer/customer.model';
import { EncrDecrService } from 'src/app/shared/services/encr-decr.service';
import Swal from 'sweetalert2';
import { DmtService } from 'src/app/shared/services/dmt.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-verify-VPA',
  templateUrl: './verify_VPA_component.html',
  styleUrls: ['./verify_VPA_component.scss']
})
export class VerifyVPAComponent implements OnInit {
  loading: boolean;

  loadingText = "Proceed";
  verifyTransaction!: FormGroup;
  upiIdError: boolean = false;
  successFlag: boolean = false;
  errorFlag: boolean = false;
  userRefId = '';
  userMobileNo = '';
  verifyFlag: boolean = false;
  amount = 0;
  customerName = '';
  constructor(
    private router: Router,
    private dmtService: DmtService,
    private EncrDecr: EncrDecrService,
    private ngxService: NgxUiLoaderService,
  ) {
    const userInfo = this.EncrDecr.decryptJson(
      sessionStorage.getItem(environment.retailerDatakey)
    ) as Customer;
    this.userRefId = userInfo?.retailer_ref_id;
    this.userMobileNo = userInfo?.mobile_number;
    this.customerName = userInfo?.retailer_name;
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (
        event instanceof RouteConfigLoadStart ||
        event instanceof ResolveStart
      ) {
        this.loadingText = "Loading verify VPA Module...";

        this.loading = true;
      }
      if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.loading = false;
      }
    });
    this.initLoginForm();
  }

  public initLoginForm(): void {
    this.verifyTransaction = new FormGroup({

      amount: new FormControl("", [Validators.required, Validators.maxLength(5)]),
      upiId: new FormControl("", [Validators.required]),
    });
  }

  // verifyVPA(data) {
  //   if (data.valid) {
  //     const verifyVpaParam = {
  //       merchant_id: '1',
  //       // account_type_ref_id: environment.account_type_ref_id,
  //       account_type_ref_id: '2',
  //       upi_id: data.value.upiId,
  //       user_ref_id: environment.account_type_ref_id,
  //     };

  //     this.dmtService.verifyVpa(verifyVpaParam).subscribe(
  //       (res: ResponseInterface) => {
  //         if (res.response_code === "200") {
  //           this.verifyFlag = true;
  //           this.successFlag=true;
  //           // this.successFlag = true;
  //           // this.errorFlag = false;
  //           // this.idDisable();
  //         } else {
  //           // this.errorFlag = true;
  //           // this.successFlag = false;
  //           // this.idDisable();
  //           this.verifyFlag = false;
  //           this.successFlag=false;

  //         }
  //       },
  //       (err) => {
  //         this.verifyFlag = false;
  //         this.successFlag=true;
  //         // alert("geting error");
  //         // this.errorFlag = false;
  //         // this.successFlag = true;
  //         // this.idDisable();
  //       }
  //     );

  //   }

  // }

  isNumeric(n: any): n is number | string {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  CheckUpiId(data) {

    var result = /^[\w.-]+@[\w.-]+$/.test(data.value.upiId);
    if (result) {

      this.verifyTransaction.controls[
        "upiId"
      ].setValidators([
        Validators.required,
        Validators.pattern(/^[\w.-]+@[\w.-]+$/),
      ]);
      this.upiIdError = false;
      this.setValid('upiId');

    } else {
      this.verifyTransaction.controls[
        "upiId"
      ].setValidators([
        Validators.required,
        Validators.pattern(/^[\w.-]+@[\w.-]+$/),
      ]);
      this.upiIdError = true;
    }

    // }

  }
  // CheckUpiId(data) {
  //   if (this.isNumeric(data.value.upiId)) {
  //     this.upiIdError = false;
  //     this.verifyTransaction.controls[
  //       "amount"
  //     ].setValidators([
  //       Validators.required,
  //     ]);
  //     this.verifyTransaction.controls[
  //       "upiId"
  //     ].setValidators([
  //       Validators.required,
  //       Validators.minLength(10),
  //       Validators.maxLength(10),
  //       Validators.pattern(/^[6-9]\d{9}$/),
  //     ]);
  //   } else {
  //     var result = /^[\w.-]+@[\w.-]+$/.test(data.value.upiId);
  //     if (result) {

  //       this.verifyTransaction.controls[
  //         "upiId"
  //       ].setValidators([
  //         Validators.required,
  //         Validators.pattern(/^[\w.-]+@[\w.-]+$/),
  //       ]);
  //       this.upiIdError = false;
  //       this.setValid('upiId');

  //     } else {
  //       this.verifyTransaction.controls[
  //         "upiId"
  //       ].setValidators([
  //         Validators.required,
  //         Validators.pattern(/^[\w.-]+@[\w.-]+$/),
  //       ]);
  //       this.upiIdError = true;
  //     }

  //   }

  // }

  setValid(controlName: string) {

    this.verifyTransaction.controls[controlName].markAsPristine();
    this.verifyTransaction.controls[controlName].markAsUntouched();
  }
  setError(controlName: string) {

    this.verifyTransaction.controls[controlName].markAsDirty();
    this.verifyTransaction.controls[controlName].markAsTouched();
  }

  public myError = (controlName: string, errorName: string) => {
    return this.verifyTransaction.controls[controlName].hasError(errorName);
  }

  retry() {
    this.successFlag = false;
    this.errorFlag = false;
    this.isEnable();
  }

  confirm() {
    if (this.verifyTransaction.valid) {
      this.amount = this.verifyTransaction.value.amount;
      let upi = this.verifyTransaction.value.upiId;
      const vpaParam = {
        payer_vpa: upi,
        amount: this.amount + '',
        account_type: '3',
        agent_mobile_number: this.userMobileNo,
        agent_name: this.customerName,
        agent_refid: this.userRefId,
        verified_name: upi,
      }
      // console.log(vpaParam);
      this.ngxService.start();
      this.dmtService.VpaUpiId(vpaParam).subscribe(
        (res: ResponseInterface) => {
          this.ngxService.stop();
          if (res.response_code === "200") {
            Swal.fire({
              title: "Success!",
              text: res.response_message,
              icon: "success",
              confirmButtonColor: "#1172b3",
              confirmButtonText: "Ok",
              allowOutsideClick: false,
              backdrop: true,
            }).then((result) => {
              location.reload();
            });
          }else{
            Swal.fire({
              title: "Error!",
              text: res.response_message,
              icon: "error",
              confirmButtonColor: "#1172b3",
              confirmButtonText: "Ok",
              allowOutsideClick: false,
              backdrop: true,
            });
          }
        },
        (err) => {
          this.ngxService.stop();
          Swal.fire({
            title: "Error!",
            text: err.error.response_message,
            icon: "error",
            confirmButtonColor: "#1172b3",
            confirmButtonText: "Ok",
            allowOutsideClick: false,
            backdrop: true,
          });
          // this.loading = false;
        }
      );
    }
  }

  proceed() {
    // this.successFlag = false;
    // this.errorFlag = false;
    // this.isEnable();
    if (this.verifyTransaction.valid) {
      this.amount = this.verifyTransaction.value.amount;
      const moneyTransferVpaParam = {
        merchant_id: "1",
        // account_type_ref_id: environment.account_type_ref_id,
        account_type_ref_id: '2',
        upi_id: this.verifyTransaction.value.upiId,
        user_ref_id: "1",
        customer_name: this.customerName,
        amount: this.amount + '',
        remarks: "",
        type: "",
        receipt: "",
      };
      // this.upiService.moneyTranferVpa(moneyTransferVpaParam).subscribe(
      //   (res: ResponseInterface) => {
      //     if (res.response_code === "200") {
      //       if (res.data.status === "SUCCESS") {
      //         Swal.fire({
      //           title: "Success!",
      //           text: "Amount sent successFully.",
      //           icon: "success",
      //           confirmButtonColor: "#1172b3",
      //           confirmButtonText: "Ok",
      //         }).then((result) => {
      //           location.reload();
      //         });
      //         // this.initLoginForm();
      //         // this.verifyTransaction.reset();

      //         this.verifyFlag=false;
      //         // sessionStorage.setItem("atp_c_otp_state", res?.data?.state);
      //       } else {
      //         Swal.fire({
      //           title: "Error!",
      //           text: "Amount sent Failed.",
      //           icon: "error",
      //           confirmButtonColor: "#1172b3",
      //           confirmButtonText: "Ok",
      //         })
      //         // sessionStorage.setItem("atp_c_otp_state", "");
      //       }
      //       // this.timeLeft = 50;
      //       // this.startResendOtpTimer();
      //     }
      //   },
      //   (err) => { }
      // );
    }

  }
  idDisable() {
    // for(let i=0; i<this.verifyTransaction.controls.; i++ ){
    this.verifyTransaction.controls['amount'].disable();
    this.verifyTransaction.controls['upiId'].disable();
    // }
  }
  isEnable() {
    this.verifyTransaction.controls['amount'].enable();
    this.verifyTransaction.controls['upiId'].enable();
  }
}
