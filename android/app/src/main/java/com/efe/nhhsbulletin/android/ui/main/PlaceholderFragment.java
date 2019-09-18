//package com.efe.nhhsbulletin.android.ui.main;
//
//import android.arch.lifecycle.ViewModelProviders;
//import android.os.Bundle;
//import android.support.annotation.NonNull;
//import android.support.v4.app.Fragment;
//import android.support.v7.widget.LinearLayoutManager;
//import android.support.v7.widget.RecyclerView;
//import android.util.Log;
//import android.view.LayoutInflater;
//import android.view.View;
//import android.view.ViewGroup;
//import android.widget.Button;
//import android.widget.CalendarView;
//import android.widget.TextView;
//
//import com.efe.nhhsbulletin.android.MainActivity;
//import com.efe.nhhsbulletin.android.R;
//
//import java.util.ArrayList;
//import java.util.Arrays;
//
///**
// * A placeholder fragment containing a simple view.
// */
//public class PlaceholderFragment extends Fragment {
//
//    private static final String TAG = PlaceholderFragment.class.getSimpleName();
//    private static final String ARG_SECTION_NUMBER = "section_number";
//
//    private PageViewModel pageViewModel;
//    private int fragmentIndex;
//
//    public static PlaceholderFragment newInstance(int index) {
//        PlaceholderFragment fragment = new PlaceholderFragment();
//        Bundle bundle = new Bundle();
//        bundle.putInt(ARG_SECTION_NUMBER, index);
//        fragment.setArguments(bundle);
//        return fragment;
//    }
//
//    @Override
//    public void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        pageViewModel = ViewModelProviders.of(this).get(PageViewModel.class);
//        int index = 1;
//        if (getArguments() != null) {
//            index = getArguments().getInt(ARG_SECTION_NUMBER);
//        }
//        fragmentIndex = index;
//        pageViewModel.setIndex(index);
//    }
//
//                break;
//            case 2:
//                root = inflater.inflate(R.layout.fragment_sports, container, false);
//                break;
//            case 3:
//                root = inflater.inflate(R.layout.fragment_schedule, container, false);
//                break;
//            case 4:
//                root = inflater.inflate(R.layout.fragment_resources, container, false);
//                break;
//        }
//        //final TextView textView = root.findViewById(R.id.section_label);
//        /*pageViewModel.getText().observe(this, new Observer<String>() {
//            @Override
//            public void onChanged(@Nullable String s) {
//                textView.setText(s);
//            }
//        });*/
//        return root;
//    }
//}