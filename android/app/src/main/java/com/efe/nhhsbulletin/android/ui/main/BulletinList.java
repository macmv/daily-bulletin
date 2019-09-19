package com.efe.nhhsbulletin.android.ui.main;

import android.app.Activity;
import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.efe.nhhsbulletin.android.R;
import com.efe.nhhsbulletin.android.connection.BulletinManager;

import java.util.ArrayList;
import java.util.Date;

public class BulletinList extends RecyclerView.Adapter {
    private static final String TAG = BulletinList.class.getSimpleName();
    private final BulletinManager bulletin;
    private final ArrayList<ListItem> items = new ArrayList<>();
    private final Activity context;
    private ProgressBar pBar;

    public BulletinList(Context context, BulletinManager bulletin) {
        this.context = (Activity) context;
        this.bulletin = bulletin;
    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        // infalte the item Layout
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.bulletin_layout, parent, false);
        // set the view's size, margins, paddings and layout parameters
        return new MyViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder viewHolder, int pos) {
        // set the data in items
        TextView title = viewHolder.itemView.findViewById(R.id.item_title);
        title.setText(items.get(pos).getTitle());
        TextView content = viewHolder.itemView.findViewById(R.id.item_content);
        content.setText(items.get(pos).getContent());
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    public void setDate(Date date) {
        Log.i(TAG, "setDate: Updating date to " + date);
        clearItems();
        bulletin.getBulletin(date, info -> {
            hideLoading();
            items.clear();
            items.add(new ListItem("Title", info.getTitle()));
            items.add(new ListItem("Sports", info.getSports()));
            items.add(new ListItem("Clubs", info.getClubs()));
            items.add(new ListItem("Lunch", info.getLunch()));
            for (String str : info.getOther()) {
                items.add(new ListItem("This should have a name parsed from the text", str));
            }
            context.runOnUiThread(this::notifyDataSetChanged);
        });
    }

    private void hideLoading() {
        context.runOnUiThread(() -> pBar.setVisibility(View.GONE));
    }

    private void clearItems() {
        items.clear();
        context.runOnUiThread(this::notifyDataSetChanged);
    }

    public void setPBar(ProgressBar pBar) {
        this.pBar = pBar;
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {
        public MyViewHolder(View itemView) {
            super(itemView);
        }
    }

    private class ListItem {
        private String title;
        private String content;

        public ListItem(String title, String content) {
            this.title = title;
            this.content = content;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}