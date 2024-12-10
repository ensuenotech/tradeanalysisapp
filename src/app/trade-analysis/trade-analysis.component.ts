import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts'; // Correctly import Highcharts
import { UserService } from '../services/user.service';

import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment';
import { getIST, predicateBy, predicateByDesc } from '../utilities/utils';
import { HttpClientModule } from '@angular/common/http';
interface Statistic {
  profit: number;
  loss: number;
  net: number;
}

interface Contribution {
  profit: number;
  loss: number;
}
interface topSymbolContribution {
  profit: number, // 60% of total profit from top symbol
  loss: number    // 30% of total loss from top symbol
}
interface TradeDetails {
  profit: number;
  loss: number;
  net: number;
}

interface DateDetails {
  profit: string;
  loss: string;
}

interface Data {
  amount: Statistic; // Total profit, loss, net
  numberOfTrades: Statistic; // Total number of trades for profit, loss, net
  average: Statistic; // Average profit, loss, net
  accuracy: Statistic; // Accuracy for profit, loss, net
  maxTradeAmount: Statistic; // Max trade amount for profit, loss, net
  maxTradeDate: DateDetails; // Date of the max profit/loss trade (in string format like 'dd-MM-yyyy')
  topAsset: Statistic; // Top asset profit, loss, net
  topAssetContribution: Contribution; // Contribution to profit/loss for top asset
  topSymbol: Statistic; // Top symbol profit, loss, net
  topSymbolContribution: Contribution; // Contribution to profit/loss for top symbol
  tradeExpense: number; // Trade expense amount
  numberOfTradingDays: Statistic; // Number of trading days for profit, loss, net
  maxDayAmount: Statistic; // Max amount for the day in profit, loss, net
  maxDate: DateDetails; // Max date for profit/loss (as a string, formatted as 'dd-MM-yyyy')
  amountOfDay: Statistic; // Amount for the day (profit, loss, net)
  averageTradePerDay: Statistic; // Average trade amount per day (profit, loss, net)
  profitCount_80: number; // Number of trades contributing 80% to profit
  lossCount_80: number; // Number of trades contributing 80% to loss
  profitCount_60: number; // Number of trades contributing 60% to profit
  lossCount_60: number; // Number of trades contributing 60% to loss
  profitCountDays_80: number; // Number of days contributing 80% to profit
  lossCountDays_80: number; // Number of days contributing 80% to loss
  profitCountDays_60: number; // Number of days contributing 60% to profit
  lossCountDays_60: number; // Number of days contributing 60% to loss
  counter3: number; // Number of 3-day streaks contributing to profit
  losscounter3: number; // Number of 3-day streaks contributing to loss
  counter5: number; // Number of 5-day streaks contributing to profit
  losscounter5: number; // Number of 5-day streaks contributing to loss
  counter10: number; // Number of 10-day streaks contributing to profit
  losscounter10: number; // Number of 10-day streaks contributing to loss
  counter20: number; // Number of 20-day streaks contributing to profit
  losscounter20: number; // Number of 20-day streaks contributing to loss
}

export interface ITradeAnalysisModel {
  amount: { profit: any, loss: any, net: any }
  amountOfDay: { profit: any, loss: any, net: any }
  numberOfTrades: { profit: any, loss: any, net: any }
  average: { profit: any, loss: any, net: any }
  accuracy: { profit: any, loss: any, net: any }
  maxTradeAmount: { profit: any, loss: any, net: any }
  maxTradeDate: { profit: any, loss: any, net: any }
  contributingTrades_80: { profit: any, loss: any }
  contributingTrades_60: null
  numberOfTradingDays: { profit: any, loss: any, net: any }
  maxDayAmount: { profit: any, loss: any, net: any }
  maxDate: { profit: any, loss: any, net: any }
  maxSymbol: null
  averageTradePerDay: { profit: any, loss: any, net: any }
  contributingDays_80: null
  contributingDays_60: null
  daysStreak_3: null
  daysStreak_5: null
  daysStreak_10: null
  daysStreak_120: null
  topAsset: { profit: any, loss: any }
  topAssetContribution: { profit: any, loss: any, net: any }
  topSymbol: any
  topSymbolContribution: any
  tradeExpense: any
  userId: any


}
@Component({
  selector: 'app-trade-analysis',
  standalone: true,
  imports: [FormsModule,RouterModule,ReactiveFormsModule,HighchartsChartModule,CommonModule,HttpClientModule],
  templateUrl: './trade-analysis.component.html',
  styleUrl: './trade-analysis.component.css'
})
export class TradeAnalysisComponent {
  activeTab: string = 'statistics';
  currentTab: string = 'statistics'; 
  @ViewChild('container', { static: false }) container: ElementRef | undefined;
  data: ITradeAnalysisModel | undefined
  userId: number | undefined
  pandldata:any = []
  Highcharts: typeof Highcharts = Highcharts;
  pandlChart!: Highcharts.Options;
  loading: boolean = false
  orderList: Array<object> = []
  isChecked: boolean = false
  profitCount_80: any
  lossCount_80: any
  profitCount_60: any
  lossCount_60: any
  profitCountDays_80: any
  lossCountDays_80: any
  profitCountDays_60: any
  lossCountDays_60: any

  counter3: any
  counter5: any
  counter10: any
  counter20: any
  losscounter3 = 0
  losscounter5 = 0
  losscounter10 = 0
  losscounter20 = 0

  constructor(private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.getTradeAnalysis().subscribe((res: any) => {
      this.data = res
    })
    this.loadChart();

  }
  loadChart() {

    this.loading = true
    this.userService.getPositions().subscribe((data: any) => {
      data.forEach((x:any) => {
        x.date = moment(x.updatedOn).format("DD-MM-YYYY")
      })
      let pandldata: { date: any; profit: any; loss: any; }[] = []
      var today = getIST()
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)

      let totalProfitLossArray: { symbol: any, pandL: number }[] = []
      let totalProfitLossArray2: { date: any, pandL: number }[] = []
      var grpd = _.groupBy(data.filter((d: { updatedOn: string | number | Date; }) => new Date(d.updatedOn) < today), "date")
      var grpdSymbol = _.groupBy(data.filter((d: { updatedOn: string | number | Date; }) => new Date(d.updatedOn) < today), "symbol")
      _.map(grpdSymbol, function (values: any[], key: any) {
        totalProfitLossArray.push({ symbol: key, pandL: _.sum(values.map((v: { pandL: any; }) => { return v.pandL })) })

      })
      _.map(grpd, function (values: any[], key: any) {

        let pl = _.sum(values.map((x: { pandL: any; }) => { return x.pandL }))
        pandldata.push({
          date: key,
          profit: pl >= 0 ? pl : "-",
          loss: pl < 0 ? pl : "-"
        })

        totalProfitLossArray2.push({ date: key, pandL: _.sum(values.map((v: { pandL: any; }) => { return v.pandL })) })
      })


      // CONTRIBUTING TRADING DATA

      let profitArr = totalProfitLossArray.filter(x => x.pandL > 0)
      profitArr.sort(predicateByDesc("pandL"))
      let lossArr = totalProfitLossArray.filter(x => x.pandL < 0)
      lossArr.sort(predicateByDesc("pandL"))

      let totalProfit = _.sum(profitArr.map(x => { return x.pandL }))
      let totalLoss = _.sum(lossArr.map(x => { return x.pandL }))

      let profit_80 = totalProfit * .8
      let loss_80 = totalLoss * .8
      let profitCount_80 = 0
      let lossCount_80 = 0

      let _profit = 0
      let _loss = 0



      profitArr.forEach((element, i) => {
        _profit += element.pandL
        if (_profit >= profit_80 && profitCount_80 == 0) { profitCount_80 = i + 1 }
        return
      })
      lossArr.forEach((element, i) => {
        _loss -= element.pandL
        if (_loss >= loss_80 && lossCount_80 == 0) { lossCount_80 = i + 1 }
        return
      })

      this.profitCount_80 = profitCount_80
      this.lossCount_80 = lossCount_80

      //trading 60% data

      let profit_60 = totalProfit * .6
      let loss_60 = totalLoss * .6
      let profitCount_60 = 0
      let lossCount_60 = 0

      let _profit6 = 0
      let _loss6 = 0

      profitArr.forEach((element, i) => {
        _profit6 += element.pandL
        if (_profit6 >= profit_60 && profitCount_60 == 0) { profitCount_60 = i + 1 }
        return
      })
      lossArr.forEach((element, i) => {
        _loss6 -= element.pandL
        if (_loss6 >= loss_60 && lossCount_60 == 0) { lossCount_60 = i + 1 }
        return
      })

      // console.log(profit_60)
      // console.log(loss_60)

      this.profitCount_60 = profitCount_60
      this.lossCount_60 = lossCount_60


      // TRADING DAYS DATA

      let profitArray = totalProfitLossArray2.filter(x => x.pandL > 0)
      profitArray.sort(predicateByDesc("pandL"))
      let lossArray = totalProfitLossArray2.filter(x => x.pandL < 0)
      lossArray.sort(predicateByDesc("pandL"))

      let totalProfit2 = _.sum(profitArray.map(x => { return x.pandL }))
      let totalLoss2 = _.sum(lossArray.map(x => { return x.pandL }))

      let profitDays_80 = totalProfit2 * .8
      let lossDays_80 = totalLoss2 * .8
      let profitCountDays_80 = 0
      let lossCountDays_80 = 0

      let _profitDays = 0
      let _lossDays = 0

      // console.log(profitArray)
      // console.log(totalProfit2)
      // console.log(lossArray)
      // console.log(totalLoss2)

      profitArray.forEach((element, i) => {
        _profitDays += element.pandL
        if (_profitDays >= profitDays_80 && profitCountDays_80 == 0) { profitCountDays_80 = i + 1 }
        return
      })
      lossArray.forEach((element, i) => {
        _lossDays -= element.pandL
        if (_lossDays >= lossDays_80 && lossCountDays_80 == 0) { lossCountDays_80 = i + 1 }
        return
      })

      // console.log(profitArray)
      // console.log(lossArray)
      // console.log(totalProfit2)
      // console.log(totalLoss2)
      // console.log(profitDays_80)
      // console.log(lossDays_80)

      this.profitCountDays_80 = profitCountDays_80
      this.lossCountDays_80 = lossCountDays_80


      // trading days 60% data

      let profitDays_60 = totalProfit2 * .6
      let lossDays_60 = totalLoss2 * .6
      let profitCountDays_60 = 0
      let lossCountDays_60 = 0

      let _profitDays6 = 0
      let _lossDays6 = 0

      profitArray.forEach((element, i) => {
        _profitDays6 += element.pandL
        if (_profitDays6 >= profitDays_60 && profitCountDays_60 == 0) { profitCountDays_60 = i + 1 }
        return
      })
      lossArray.forEach((element, i) => {
        _lossDays6 -= element.pandL
        if (_lossDays6 >= lossDays_60 && lossCountDays_60 == 0) { lossCountDays_60 = i + 1 }
        return
      })

      this.profitCountDays_60 = profitCountDays_60
      this.lossCountDays_60 = lossCountDays_60

      // STREAK DAYS OF PandL

      let counter = 0
      let counter3 = 0
      let counter5 = 0
      let counter10 = 0
      let counter20 = 0
      let losscounter = 0
      let losscounter3 = 0
      let losscounter5 = 0
      let losscounter10 = 0
      let losscounter20 = 0
      //  let datesStreak = totalProfitLossArray2.map(x =>{})
      // let datesStreak3 =[] = totalProfitLossArray2.map(x =>{
      //   return x.date
      // })

      totalProfitLossArray2.sort(predicateBy("date"))
      totalProfitLossArray2.forEach((x, i) => {
        if (x.pandL > 0) {
          counter += 1
        }
        else {
          counter = 0
        }
        if (x.pandL < 0) {
          losscounter += 1
        }
        else {
          losscounter = 0
        }
        if (counter > 0) {
          if (counter % 3 == 0) {
            counter3 += 1
          }
          else if (counter % 5 == 0) {
            counter5 += 1
          }
          else if (counter % 10 == 0) {
            counter10 += 1
          }
          else if (counter % 20 == 0) {
            counter20 += 1
          }
        }
        if (losscounter > 0) {
          if (losscounter % 3 == 0) {
            losscounter3 += 1
          }
          else if (losscounter % 5 == 0) {
            losscounter5 += 1
          }
          else if (losscounter % 10 == 0) {
            losscounter10 += 1
          }
          else if (losscounter % 20 == 0) {
            losscounter20 += 1
          }
        }

      })

      this.counter3 = counter3
      this.counter5 = counter5
      this.counter10 = counter10
      this.counter20 = counter20

      this.losscounter3 = losscounter3
      this.losscounter5 = losscounter5
      this.losscounter10 = losscounter10
      this.losscounter20 = losscounter20

      this.pandldata = pandldata
      this.loading = false
      this.pandlChart = {
        time: {
          timezoneOffset: -330,
        },
        plotOptions: {
          series: {
            stickyTracking: false,
          },
        },
        xAxis: {

          categories: this.pandldata.map((data: { date: any; }) => { return data.date }),
        },
        colors: [
          "#6060f5",
          "#f90505",
        ],
        credits: {
          enabled: false,
        },
        chart: {
          // width: document.querySelector('.container').clientWidth - (.05 * document.querySelector('.container').clientWidth),
          // zoomType: "x",
          type: "spline",
        },
        yAxis: [
          {
            title: {
              text: "Profit and Loss",
            },
          },
          {
            labels: {
              format: "{value}",
              style: {
                // color: Highcharts.getOptions().colors[0],
              },
            },
            title: {
              text: "Profit and Loss",
              style: {
                // color: Highcharts.getOptions().colors[0],
              },
            },
            opposite: true,
          },
        ],
        title: { text: "" },
        series: [
          {
            name: "Profit",
            type: "column",
            data: this.pandldata.map((data: { profit: any; }) => { return data.profit }),
          },
          {
            name: "Loss",
            type: "column",
            data: this.pandldata.map((data: { loss: any; }) => { return data.loss }),
          }
        ],
      };
    })



  }
  // data = {
  //   amount: {
  //     profit: 1000,
  //     loss: 500,
  //     net: 500
  //   },
  //   numberOfTrades: {
  //     profit: 10,
  //     loss: 5,
  //     net: 5
  //   }
  // }
  // Method to switch tabs
  showTab(tabName: string): void {
    this.currentTab = tabName;
    if(this.currentTab == 'chart')
    {
      this.loadChart();
    }
  }
  // pandlChart = {
  //   // chart: {
  //   //   type: 'line'
  //   // },
  //   // title: {
  //   //   text: 'Profit and Loss Chart'
  //   // },
  //   // series: [
  //   //   {
  //   //     name: 'Profit',
  //   //     data: [1, 2, 3, 4, 5, 6]
  //   //   },
  //   //   {
  //   //     name: 'Loss',
  //   //     data: [0, 1, 1, 2, 3, 4]
  //   //   }
  //   // ]
  // };
  // Highcharts = Highcharts; // Assign Highcharts to the component
  // Highcharts = require('highcharts');

}
