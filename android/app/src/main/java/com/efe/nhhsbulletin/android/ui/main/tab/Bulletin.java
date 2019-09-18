package com.efe.nhhsbulletin.android.ui.main.tab;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CalendarView;
import android.widget.TextView;

import com.efe.nhhsbulletin.android.MainActivity;
import com.efe.nhhsbulletin.android.R;
import com.efe.nhhsbulletin.android.ui.main.BulletinList;

import java.util.ArrayList;
import java.util.Arrays;

public class Bulletin extends Fragment {

    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {
        //different pages in app
        View root = inflater.inflate(R.layout.fragment_bulletin, container, false);
        // root

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
        final Button calendarButton = root.findViewById(R.id.calendarButton);

        // get the reference of CalendarView
        final CalendarView simpleCalendarView = root.findViewById(R.id.simpleCalendarView);
        // perform setOnDateChangeListener event on CalendarView
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
        return root;
    }

}