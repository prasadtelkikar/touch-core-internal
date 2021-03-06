import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../environments/environment';
import { HttpService } from '../services/http.service';
import { ToastrService } from 'ngx-toastr';
import { GratificationService } from 'src/app/services/gratification.service';
import { RewardModal } from '../model/reward-model';
import { AuthService } from '../services/auth.service';
// import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-reward',
    templateUrl: './reward.component.html',
    styleUrls: ['./reward.component.css']
})
export class RewardComponent implements OnInit {
    @ViewChild(DataTableDirective,  {static: false})
    dtElement: DataTableDirective;
    // @ViewChild('addReward', { static: false }) dtElements: DataTableDirective;
    rewards: any = [];
    reward: RewardModal = new RewardModal;
    
    dtOptions: {};
    dtTrigger: Subject<any> = new Subject<any>();
    promises: Promise<any>[] = [];

    constructor(private httpc: HttpClient, private httpService: HttpService, private SpinnerService: NgxSpinnerService,
        private toastr: ToastrService, private gService: GratificationService, private authService: AuthService
    ) { }

    ngOnInit() {
        this.SpinnerService.show();
        this.promises.push(this.GetRewards());

        Promise.all(this.promises).then(() => {
            this.SpinnerService.hide();
        });

        this.dtOptions = {
            pagingType: 'full_numbers',
            columnDefs: [
                { defaultContent: "", targets: "_all" },
                { targets: [ 0 ,1, 2, 3], orderable: true },
                { targets: "_all", orderable: false }
            ],
            lengthMenu: [5, 20, 40],
            pageLength: 10,
            dom: 'Bfrtip',
            // dom: "<'row'<'col-sm-3'B>>" + "<'row'<'col-sm-12'tr>>" +
            // "<'row table-control-row'<'col-sm-3'i><'col-sm-3'l><'col-sm-6'p>>",
            // buttons: [
            //  'copy',
            //  'print',
            //  'excel',
            // ]
            "buttons": [
                { "extend": 'print', "text": 'Print', "className": 'fa fa-print btn btn-info btn-md' },
            ],
        };
    }

    async GetRewards(): Promise<any> {
        return this.gService.GetRewards().then((result) => {
            this.rewards = result;
            this.dtTrigger.next();
        });
    }

    onRewardAdded(newReward: any) {
        // this.GetRewards();
        console.log(newReward);
       this.toggleModal("#addRewardModal");
       this.toastr.success('Sucess');
        this.reRender();
    }

    EditForm(reward: any) {
        this.toggleModal("#addRewardModal");
        this.reward = {
            badgeId: reward.badgeId,
            employeeId: reward.employeeId,
            comments: reward.comments
        }
    }

    reRender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            this.ngOnInit();
        });
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }

    toggleModal(selector: string) {
        (<any>$(selector)).modal('toggle');
    }
}

