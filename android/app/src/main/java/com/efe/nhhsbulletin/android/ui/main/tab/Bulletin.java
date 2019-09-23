package com.efe.nhhsbulletin.android.ui.main.tab;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.efe.nhhsbulletin.android.MainActivity;
import com.efe.nhhsbulletin.android.R;
import com.efe.nhhsbulletin.android.connection.BulletinManager;
import com.efe.nhhsbulletin.android.ui.main.BulletinList;
import com.wdullaer.materialdatetimepicker.date.DatePickerDialog;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Locale;

public class Bulletin extends Fragment implements DatePickerDialog.OnDateSetListener {

    private BulletinManager bulletin;
    DatePickerDialog datePickerDialog;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setRetainInstance(true);
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_bulletin, container, false);
        bulletin = ((MainActivity) getContext()).getServer().getBulletinManager();

        RecyclerView bulletinListView = root.findViewById(R.id.bulletinList);

        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(inflater.getContext());
        bulletinListView.setLayoutManager(linearLayoutManager);

        BulletinList bulletinList = new BulletinList(getContext(), bulletin);
        bulletinListView.setAdapter(bulletinList); // set the Adapter to RecyclerView

        TextView titleView = root.findViewById(R.id.titleView);

        ProgressBar pBar = root.findViewById(R.id.pBar);

        Calendar datePicker = Calendar.getInstance();

        //set onDateSetListener that detects when you set a date and press OK
        DatePickerDialog.OnDateSetListener date = (view, year, monthOfYear, dayOfMonth) -> {
            datePicker.set(Calendar.YEAR, year);
            datePicker.set(Calendar.MONTH, monthOfYear);
            datePicker.set(Calendar.DAY_OF_MONTH, dayOfMonth);

            ((MainActivity) inflater.getContext()).hideSchoolName();
            bulletinListView.setVisibility(View.VISIBLE);
            bulletinList.setDate(new Date(new GregorianCalendar(year, monthOfYear, dayOfMonth).getTimeInMillis()));
            titleView.setVisibility(View.VISIBLE);
            titleView.setText(String.format(Locale.ENGLISH, "NHHS bulletin for %02d/%02d/%04d", monthOfYear + 1, dayOfMonth, year));
            bulletinList.setPBar(pBar);
            pBar.setVisibility(View.VISIBLE);
        };

        //initialize date picker dialog
        datePickerDialog = DatePickerDialog.newInstance(
                date,
                datePicker.get(Calendar.YEAR),
                datePicker.get(Calendar.MONTH),
                datePicker.get(Calendar.DAY_OF_MONTH));

        //set min and max dates based on bulletin cache
        Calendar min_date = Calendar.getInstance();
        min_date.setTime((bulletin.getAvailableDates(new Date()).get(0)));
        Calendar max_date = Calendar.getInstance();
        max_date.setTime(bulletin.getAvailableDates(new Date()).get(bulletin.getAvailableDates(new Date()).size() - 1));
        datePickerDialog.setMinDate(min_date);
        datePickerDialog.setMaxDate(max_date);

        //Disable all SUNDAYS and SATURDAYS between Min and Max Dates
        for (Calendar loopdate = min_date; min_date.before(max_date); min_date.add(Calendar.DATE, 1), loopdate = min_date) {
            int dayOfWeek = loopdate.get(Calendar.DAY_OF_WEEK);
            if (dayOfWeek == Calendar.SUNDAY || dayOfWeek == Calendar.SATURDAY) {
                Calendar[] disabledDays =  new Calendar[1];
                disabledDays[0] = loopdate;
                datePickerDialog.setDisabledDays(disabledDays);
            }
        }

        //calendar button
        ImageButton calendarCaller = ((MainActivity) inflater.getContext()).findViewById(R.id.calendarButton);
        calendarCaller.setOnClickListener(v -> {
            //TODO: If you want to not have to press the OK button, then we'll need to use a custom DatePickerFragment
            //DialogFragment newFragment = new DatePickerFragment();
            //newFragment.show(((MainActivity) inflater.getContext()).getSupportFragmentManager(), "datePicker");
            datePickerDialog.show(((MainActivity) getContext()).getFragmentManager(), "DatePickerDialog");

            //datePickerDialog.getButton(DatePickerDialog.BUTTON_POSITIVE).setVisibility(View.GONE);
            //datePickerDialog.getButton(DatePickerDialog.BUTTON_NEGATIVE).setVisibility(View.GONE);
        });

        return root;
    }

    @Override
    public void onDateSet(DatePickerDialog view, int year, int monthOfYear, int dayOfMonth) {

    }
}