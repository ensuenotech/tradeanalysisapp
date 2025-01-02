import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrl: './journal.component.css'
})
export class JournalComponent  {
  viewLogsVisible = true;  // Default to View Logs being visible
addLogVisible = false;

  logForm!: FormGroup;
    // Sample data for the logs (you can replace this with actual data from your backend or service)
    logs = [
      {
        date: '2024-01-01',
        symbol: 'AAPL',
        quantity: 100,
        tradeType: 'Buy',
        pnl: 200,
        result: 'Profit',
        remarks: 'Great trade, stock price increased.'
      },
      {
        date: '2024-01-02',
        symbol: 'GOOGL',
        quantity: 50,
        tradeType: 'Sell',
        pnl: -150,
        result: 'Loss',
        remarks: 'Stock price dropped unexpectedly.'
      },
      {
        date: '2024-01-03',
        symbol: 'TSLA',
        quantity: 30,
        tradeType: 'Buy',
        pnl: 300,
        result: 'Profit',
        remarks: 'Strong uptrend observed.'
      },
      {
        date: '2024-01-04',
        symbol: 'MSFT',
        quantity: 200,
        tradeType: 'Sell',
        pnl: 100,
        result: 'Profit',
        remarks: 'Sold after price reached target.'
      },
    ];
// logs: any[] = [];  // Store logs for display in View Logs

constructor(private fb: FormBuilder) {}

ngOnInit(): void {
  this.initializeForm();
}

initializeForm() {
  this.logForm = this.fb.group({
    date: ['', Validators.required],
    symbol: ['', Validators.required],
    quantity: ['', Validators.required],
    tradeType: ['', Validators.required],
    pnl: ['', Validators.required],
    result: ['', Validators.required],
    remarks: ['', Validators.required],
  });
}

// Switch to View Logs
showViewLogs() {
  this.viewLogsVisible = true;
  this.addLogVisible = false;
}

// Switch to Add Log form
showAddLog() {
  this.viewLogsVisible = false;
  this.addLogVisible = true;
}

// Handle form submission
onSubmit() {
  if (this.logForm.valid) {
    const newLog = this.logForm.value;
    const tradeDataJson = JSON.stringify(this.logForm.value, null, 2);  // Converts the form values to a formatted JSON string
    // console.log('[positi] Data (JSON):', tradeDataJson);
    // console.log(newLog)
    this.logs.push(newLog);  // Add the new log to the logs array
    this.logForm.reset();  // Reset form after submission
    this.showViewLogs();  // Switch back to View Logs
  }
}
cancelAddLog() {
  // Reset the form or toggle the visibility of the form
  this.logForm.reset();  // Resets the form fields to their initial state
  this.addLogVisible = false;  // Optionally, hide the "Add Logs" form
}

}
