import {Component, OnInit, ViewChild} from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  calendarPlugins = [dayGridPlugin];
  calendarEvents: any[];
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  openedModal: BsModalRef;

  form: FormGroup;

  currentEvent: any;

  constructor(private modalService: BsModalService) {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.calendarEvents = [{title: 'test', date: '2019-04-10'}];
  }

  openModalCreate(modal) {
    this.openedModal = this.modalService.show(modal);
    /* const calendarApi = this.calendarComponent.getApi();
     this.calendarEvents.push();
     calendarApi.addEvent({title: 'test2', date: '2019-04-11'});
     console.log(this.calendarEvents);*/
  }

  openModalEdit(event, modal) {
    this.currentEvent = event.event;
    this.form.get('title').setValue(event.event.title);
    this.form.get('date').setValue(event.event.start);
    this.openedModal = this.modalService.show(modal);
  }

  createEvent() {
    console.log(this.form.value);
    const calendarApi = this.calendarComponent.getApi();
    const formValue = this.form.value;
    calendarApi.addEvent({
      title: formValue.title,
      date: moment(formValue.date).format('YYYY-MM-DD')
    });
    this.form.reset();
    this.openedModal.hide();
  }

  editEvent() {
    this.currentEvent.setProp('title', this.form.get('title').value);
    this.currentEvent.setStart(moment(this.form.get('date').value).format('YYYY-MM-DD'), {maintainDuration: true});
    this.form.reset();
    this.openedModal.hide();
  }
}
