package com.efe.nhhsbulletin.android.ui.main.tab;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.efe.nhhsbulletin.android.R;

public class Schedule extends Fragment {
    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater, ViewGroup container,
            Bundle savedInstanceState) {
        final LayoutInflater inflaterF = inflater;

        //root
        View root = inflater.inflate(R.layout.fragment_schedule, container, false);

        return root;
    }
}
