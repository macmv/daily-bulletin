
package com.efe.nhhsbulletin.android.ui.main.tab;

import android.app.DatePickerDialog;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CalendarView;
import android.widget.DatePicker;
import android.widget.ImageButton;
import android.widget.TextView;

import com.efe.nhhsbulletin.android.MainActivity;
import com.efe.nhhsbulletin.android.R;
import com.efe.nhhsbulletin.android.ui.main.BulletinList;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Locale;

public class Bulletin extends Fragment {

    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {
        final LayoutInflater inflaterF = inflater;
        //rooot
        View root = inflater.inflate(R.layout.fragment_bulletin, container, false);

        // ArrayList for person names
        ArrayList personNames = new ArrayList<>(Arrays.asList("Item 1", "item 2", "item 3", "item 4", "item 5", "item 6", "item 7", "item 8", "item 9", "item ..."));
        // get the reference of RecyclerView
        final RecyclerView recyclerView = root.findViewById(R.id.recyclerView);
        // set a LinearLayoutManager with default vertical orientation
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(MainActivity.getAppContext());
        recyclerView.setLayoutManager(linearLayoutManager);
        //  call the constructor of BulletinList to send the reference and data to Adapter
        BulletinList bulletinList = new BulletinList(root.getContext(), personNames);
        recyclerView.setAdapter(bulletinList); // set the Adapter to RecyclerView

        //get title text and calendar button
        final TextView titleView = root.findViewById(R.id.titleView);
        //final Button calendarButton = root.findViewById(R.id.calendarButton);

        final Calendar myCalendar = Calendar.getInstance();
        final DatePickerDialog.OnDateSetListener date = new DatePickerDialog.OnDateSetListener() {

            @Override
            public void onDateSet(DatePicker view, int year, int monthOfYear,
                                  int dayOfMonth) {
                // TODO Auto-generated method stub
                myCalendar.set(Calendar.YEAR, year);
                myCalendar.set(Calendar.MONTH, monthOfYear);
                myCalendar.set(Calendar.DAY_OF_MONTH, dayOfMonth);
                //updateLabel();
                String myFormat = "MM/dd/yyyy"; //In which you need put here
                SimpleDateFormat sdf = new SimpleDateFormat(myFormat, Locale.US);
                //Log.i(Bulletin.class.getSimpleName(), sdf.format(myCalendar.getTime()));
                titleView.setText("NHHS Bulletin for " + sdf.format(myCalendar.getTime()));
            }

        };

        ImageButton calendarButton = ((MainActivity) inflaterF.getContext()).findViewById(R.id.calendarButton);
        calendarButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                new DatePickerDialog( ((MainActivity) inflaterF.getContext()), date, myCalendar
                        .get(Calendar.YEAR), myCalendar.get(Calendar.MONTH),
                        myCalendar.get(Calendar.DAY_OF_MONTH)).show();
            }
        });

        // get the reference of CalendarView
        /*final CalendarView simpleCalendarView = root.findViewById(R.id.simpleCalendarView);
        // perform setOnDateChangeListener event on CalendarView
<<<<<<< Updated upstream
        simpleCalendarView.setOnDateChangeListener((view, year, month, dayOfMonth) -> {
            // add code to load current day's bulletin today
            //System.out.println(String.format("Today is: %02d/%02d/%04d", month + 1, dayOfMonth, year));
            //hide calendar and show recycler view
            ((MainActivity) inflater.getContext()).hideSchoolName();
            simpleCalendarView.setVisibility(View.GONE);
            recyclerView.setVisibility(View.VISIBLE);
            titleView.setVisibility(View.VISIBLE);
            titleView.setText(String.format("NHHS bulletin for %02d/%02d/%04d", month + 1, dayOfMonth, year));
            calendarButton.setVisibility(View.VISIBLE);
        });

        //onClickListener for calendar button that takes user back to calendar
        calendarButton.setOnClickListener(v -> {
            //show calendar and hide recycler view
            ((MainActivity) inflater.getContext()).showSchoolName();
            simpleCalendarView.setVisibility(View.VISIBLE);
            recyclerView.setVisibility(View.GONE);
            titleView.setVisibility(View.GONE);
            calendarButton.setVisibility(View.GONE);
        });
=======
        simpleCalendarView.setOnDateChangeListener(new CalendarView.OnDateChangeListener() {
            @Override
            public void onSelectedDayChange(CalendarView view, int year, int month, int dayOfMonth) {
                // add code to load current day's bulletin today
                //System.out.println(String.format("Today is: %02d/%02d/%04d", month + 1, dayOfMonth, year));
                //hide calendar and show recycler view
                ((MainActivity) inflaterF.getContext()).hideSchoolName();
                simpleCalendarView.setVisibility(View.GONE);
                recyclerView.setVisibility(View.VISIBLE);
                titleView.setVisibility(View.VISIBLE);
                titleView.setText(String.format("NHHS bulletin for %02d/%02d/%04d", month + 1, dayOfMonth, year));
                //calendarButton.setVisibility(View.VISIBLE);
            }
        });*/

        //onClickListener for calendar button that takes user back to calendar
        /*calendarButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //show calendar and hide recycler view
                ((MainActivity) inflaterF.getContext()).showSchoolName();
                simpleCalendarView.setVisibility(View.VISIBLE);
                recyclerView.setVisibility(View.GONE);
                titleView.setVisibility(View.GONE);
                //calendarButton.setVisibility(View.GONE);
            }
        });*/
        return root;
    }

}
