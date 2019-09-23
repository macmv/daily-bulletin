package com.efe.nhhsbulletin.android.ui.main;

import android.app.DatePickerDialog;
import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.DialogFragment;
import android.text.format.DateFormat;
import android.util.Log;
import android.widget.DatePicker;

import java.util.Calendar;

public class DatePickerFragment extends DialogFragment implements DatePickerDialog.OnDateSetListener {
    public class MyDatePickerDialog extends DatePickerDialog {
        private Calendar calendar;
        private final String format = "EEEE, MMMM dd, yyyy";

        // Regular constructor
        public MyDatePickerDialog(Context context, OnDateSetListener callBack, int year, int monthOfYear, int dayOfMonth) {
            super(context, callBack, year, monthOfYear, dayOfMonth);
            calendar = Calendar.getInstance();
        }

        // Short constructor
        public MyDatePickerDialog(Context context, OnDateSetListener callBack, Calendar calendar) {
            super(context, callBack, calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), calendar.get(Calendar.DAY_OF_MONTH));
            this.calendar = calendar;
        }

        @Override
        public void onDateChanged(DatePicker view, int year, int month, int day) {
            super.onDateChanged(view, year, month, day);
            calendar.set(year, month, day);
            setTitle(DateFormat.format(format, calendar));
            //Log.v("DatePickerFragment", "onDateChanged");
        }
    }

    private MyDatePickerDialog mDatePickerDialog;

    @NonNull
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        mDatePickerDialog = new MyDatePickerDialog(getContext(), this, Calendar.getInstance());
        //mDatePickerDialog.getDatePicker().setMinDate();
        return mDatePickerDialog;
    }

    @Override
    public void onDateSet(DatePicker view, int year, int month, int day) {
        Log.v("DatePickerFragment", "onDateSet");
    }
}