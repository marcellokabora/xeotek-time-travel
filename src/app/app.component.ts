import { Component } from "@angular/core"
import * as Highcharts from "highcharts/highstock"

import { webSocket } from 'rxjs/webSocket'
import { of, Subscription } from 'rxjs'
import { animate, state, style, transition, trigger } from "@angular/animations"
// import { concatMap, delay } from 'rxjs/operators'

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('500ms', style({ opacity: 0, transform: 'translateY(10px)' })),
      ]),
    ]),
  ]

})
export class AppComponent {

  stateOfElement: string
  rate$: Subscription
  Highcharts: typeof Highcharts = Highcharts
  chardata: any[] = []
  chartOptions: any
  subject = webSocket('wss://ws.coincap.io/prices?assets=bitcoin')
  data: any = []

  constructor() {

  }

  ngOnInit() {
    this.subject.pipe(
      // concatMap(item => of(item).pipe(delay(1000)))
    ).subscribe((data: any) => {
      this.data.push({
        time: Date.now(),
        value: data.bitcoin
      })
      this.chardata.push([
        Date.now(),
        Number(data.bitcoin)
      ])
      this.chartOptions = {
        series: [
          {
            data: this.chardata,
          },
        ],
        chart: {
          type: 'column',
          zoomType: 'x',
          events: {
            selection: function (event: any) {
              console.log(event.target.xAxis[0].dataMin);
              console.log(event.target.xAxis[0].dataMax);
            },
          },
        },
        title: {
          text: "",
        },
        xAxis: {
          type: 'datetime',
          // min: 1535068800000,
          // max: 1535130316000,
          labels: {
            format: '{value:%H:%M}'
          }
        },
        exporting: { enabled: false },
        navigator: { enabled: false },

      }
    })
  }


}
