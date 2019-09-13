package com.efe.nhhsbulletin.android.ui.main;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.arch.lifecycle.ViewModelProviders;
import android.widget.CalendarView;

import com.efe.nhhsbulletin.android.R;

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
                root = inflater.inflate(R.layout.fragment_bulletin, container, false);
                CalendarView simpleCalendarView = root.findViewById(R.id.simpleCalendarView); // get the reference of CalendarView
                // perform setOnDateChangeListener event on CalendarView
                simpleCalendarView.setOnDateChangeListener(new CalendarView.OnDateChangeListener() {
                    @Override
                    public void onSelectedDayChange(CalendarView view, int year, int month, int dayOfMonth) {
                        // add code to load current day's bulletin today
                        System.out.println(String.format("Today is: %02d/%02d/%04d", month + 1, dayOfMonth, year));
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