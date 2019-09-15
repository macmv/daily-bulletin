package com.efe.nhhsbulletin.android.ui.main;

import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.arch.lifecycle.ViewModelProviders;
import android.widget.Button;
import android.widget.CalendarView;
import android.widget.TextView;

import com.efe.nhhsbulletin.android.MainActivity;
import com.efe.nhhsbulletin.android.R;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;

/**
 * A placeholder fragment containing a simple view.
 */
public class PlaceholderFragment extends Fragment {

    private static final String ARG_SECTION_NUMBER = "section_number";

    private PageViewModel pageViewModel;
    private int fragmentIndex;

    public static PlaceholderFragment newInstance(int index) {
        PlaceholderFragment fragment = new PlaceholderFragment();
        Bundle bundle = new Bundle();
        bundle.putInt(ARG_SECTION_NUMBER, index);
        fragment.setArguments(bundle);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        pageViewModel = ViewModelProviders.of(this).get(PageViewModel.class);
        int index = 1;
        if (getArguments() != null) {
            index = getArguments().getInt(ARG_SECTION_NUMBER);
        }
        fragmentIndex = index;
        pageViewModel.setIndex(index);
    }

    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {
        //different pages in app
        View root = inflater.inflate(R.layout.fragment_bulletin, container, false);
        switch (fragmentIndex) {
            case 1:
                // root
                root = inflater.inflate(R.layout.fragment_bulletin, container, false);

                // ArrayList for person names
                ArrayList personNames = new ArrayList<>(Arrays.asList("Item 1", "item 2", "item 3", "item 4", "item 5", "item 6", "item 7", "item 8", "item 9", "item ..."));
                // get the reference of RecyclerView
                final RecyclerView recyclerView = (RecyclerView) root.findViewById(R.id.recyclerView);
                // set a LinearLayoutManager with default vertical orientation
                LinearLayoutManager linearLayoutManager = new LinearLayoutManager(MainActivity.getAppContext());
                recyclerView.setLayoutManager(linearLayoutManager);
                //  call the constructor of CustomAdapter to send the reference and data to Adapter
                CustomAdapter customAdapter = new CustomAdapter(root.getContext(), personNames);
                recyclerView.setAdapter(customAdapter); // set the Adapter to RecyclerView

                //get title text and calendar button
                final TextView titleView = root.findViewById(R.id.titleView);
                final Button calendarButton = root.findViewById(R.id.calendarButton);

                // get the reference of CalendarView
                final CalendarView simpleCalendarView = root.findViewById(R.id.simpleCalendarView);
                // perform setOnDateChangeListener event on CalendarView
                simpleCalendarView.setOnDateChangeListener(new CalendarView.OnDateChangeListener() {
                    @Override
                    public void onSelectedDayChange(CalendarView view, int year, int month, int dayOfMonth) {
                        // add code to load current day's bulletin today
                        //System.out.println(String.format("Today is: %02d/%02d/%04d", month + 1, dayOfMonth, year));
                        //hide calendar and show recycler view
                        simpleCalendarView.setVisibility(View.GONE);
                        recyclerView.setVisibility(View.VISIBLE);
                        titleView.setVisibility(View.VISIBLE);
                        titleView.setText(String.format("NHHS bulletin for %02d/%02d/%04d", month + 1, dayOfMonth, year));
                        calendarButton.setVisibility(View.VISIBLE);
                    }
                });

                //onClickListener for calendar button that takes user back to calendar
                calendarButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        //show calendar and hide recycler view
                        simpleCalendarView.setVisibility(View.VISIBLE);
                        recyclerView.setVisibility(View.GONE);
                        titleView.setVisibility(View.GONE);
                        calendarButton.setVisibility(View.GONE);
                    }
                });

                break;
            case 2:
                root = inflater.inflate(R.layout.fragment_sports, container, false);
                break;
            case 3:
                root = inflater.inflate(R.layout.fragment_schedule, container, false);
                break;
            case 4:
                root = inflater.inflate(R.layout.fragment_resources, container, false);
                break;
        }
        //final TextView textView = root.findViewById(R.id.section_label);
        /*pageViewModel.getText().observe(this, new Observer<String>() {
            @Override
            public void onChanged(@Nullable String s) {
                textView.setText(s);
            }
        });*/
        return root;
    }
}