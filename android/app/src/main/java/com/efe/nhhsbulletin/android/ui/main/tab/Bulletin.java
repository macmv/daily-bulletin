package com.efe.nhhsbulletin.android.ui.main.tab;

import android.app.DatePickerDialog;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.efe.nhhsbulletin.android.MainActivity;
import com.efe.nhhsbulletin.android.R;
import com.efe.nhhsbulletin.android.connection.BulletinManager;
import com.efe.nhhsbulletin.android.ui.main.BulletinList;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Locale;

public class Bulletin extends Fragment {

    private BulletinManager bulletin;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        //root
        View root = inflater.inflate(R.layout.fragment_bulletin, container, false);
        bulletin = ((MainActivity) getContext()).getServer().getBulletinManager();

        // ArrayList for person names
        // get the reference of RecyclerView
        final RecyclerView bulletinListView = root.findViewById(R.id.bulletinList);
        // set a LinearLayoutManager with default vertical orientation
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(MainActivity.getAppContext());
        bulletinListView.setLayoutManager(linearLayoutManager);
        //  call the constructor of BulletinList to send the reference and data to Adapter
        BulletinList bulletinList = new BulletinList(getContext(), bulletin);
        bulletinListView.setAdapter(bulletinList); // set the Adapter to RecyclerView

        //get title text and calendar button
        TextView titleView = root.findViewById(R.id.titleView);
        Button calendarButton = root.findViewById(R.id.calendarButton);

        ProgressBar pBar = root.findViewById(R.id.pBar);

        //calendar date picker
        final Calendar myCalendar = Calendar.getInstance();

        DatePickerDialog.OnDateSetListener date = (view, year, monthOfYear, dayOfMonth) -> {
            myCalendar.set(Calendar.YEAR, year);
            myCalendar.set(Calendar.MONTH, monthOfYear);
            myCalendar.set(Calendar.DAY_OF_MONTH, dayOfMonth);

            ((MainActivity) inflater.getContext()).hideSchoolName();
            bulletinListView.setVisibility(View.VISIBLE);
            bulletinList.setDate(new Date(new GregorianCalendar(year, monthOfYear, dayOfMonth).getTimeInMillis()));
            titleView.setVisibility(View.VISIBLE);
            titleView.setText(String.format(Locale.ENGLISH, "NHHS bulletin for %02d/%02d/%04d", monthOfYear + 1, dayOfMonth, year));
            bulletinList.setPBar(pBar);
            pBar.setVisibility(View.VISIBLE);
        };

        ImageButton calendarCaller = ((MainActivity) inflater.getContext()).findViewById(R.id.calendarButton);

        calendarCaller.setOnClickListener(v -> {
            new DatePickerDialog(((MainActivity) inflater.getContext()), date, myCalendar
                    .get(Calendar.YEAR), myCalendar.get(Calendar.MONTH),
                    myCalendar.get(Calendar.DAY_OF_MONTH)).show();
        });

        // get the reference of CalendarView
        /*CalendarView simpleCalendarView = root.findViewById(R.id.simpleCalendarView);
        // perform setOnDateChangeListener event on CalendarView
        simpleCalendarView.setOnDateChangeListener((view, year, month, dayOfMonth) -> {
            // add code to load current day's bulletin today
            //System.out.println(String.format("Today is: %02d/%02d/%04d", month + 1, dayOfMonth, year));
            //hide calendar and show recycler view
            ((MainActivity) inflater.getContext()).hideSchoolName();
            simpleCalendarView.setVisibility(View.GONE);
            bulletinListView.setVisibility(View.VISIBLE);
            bulletinList.setDate(new Date(new GregorianCalendar(year, month, dayOfMonth).getTimeInMillis()));
            titleView.setVisibility(View.VISIBLE);
            titleView.setText(String.format(Locale.ENGLISH, "NHHS bulletin for %02d/%02d/%04d", month + 1, dayOfMonth, year));
            calendarButton.setVisibility(View.VISIBLE);
            bulletinList.setPBar(pBar);
            pBar.setVisibility(View.VISIBLE);
        });

        //onClickListener for calendar button that takes user back to calendar
        calendarButton.setOnClickListener(v -> {
            //show calendar and hide recycler view
            ((MainActivity) inflater.getContext()).showSchoolName();
            simpleCalendarView.setVisibility(View.VISIBLE);
            bulletinListView.setVisibility(View.GONE);
            titleView.setVisibility(View.GONE);
            calendarButton.setVisibility(View.GONE);
            pBar.setVisibility(View.GONE);
        });*/
        return root;
    }

}