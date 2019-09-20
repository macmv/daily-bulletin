package com.efe.nhhsbulletin.android.ui.main.tab;

import android.app.DatePickerDialog;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
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

        ImageButton calendarCaller = ((MainActivity) inflater.getContext()).findViewById(R.id.calendarButton);

        calendarCaller.setOnClickListener(v -> {
            new DatePickerDialog((inflater.getContext()), date,
                    datePicker.get(Calendar.YEAR),
                    datePicker.get(Calendar.MONTH),
                    datePicker.get(Calendar.DAY_OF_MONTH)).show();
        });

        return root;
    }

}