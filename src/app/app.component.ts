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
    this.calendarEvents = [{title: 'Birthday', date: moment(new Date()).format('YYYY-MM-DD')}];
  }

  openModalCreate(modal) {
    this.openedModal = this.modalService.show(modal);
  }

  openModalEdit(event, modal) {
    this.currentEvent = event.event;
    this.form.patchValue({
      title: event.event.title,
      date: event.event.start
    });
    this.openedModal = this.modalService.show(modal);
  }

  createEvent() {
    const calendarApi = this.calendarComponent.getApi();
    const formValue = this.form.value;
    calendarApi.addEvent({
      title: formValue.title,
      date: moment(formValue.date).format('YYYY-MM-DD')
    });
    localStorage.setItem('events', JSON.stringify(this.calendarEvents));
    this.form.reset();
    this.openedModal.hide();
  }

  editEvent() {
    this.currentEvent.setProp('title', this.form.value.title);
    this.currentEvent.setStart(moment(this.form.value.date).format('YYYY-MM-DD'), {maintainDuration: true});
    this.form.reset();
    this.openedModal.hide();
  }

  delete() {
    this.openedModal.hide();
    this.currentEvent.remove();
  }
}
