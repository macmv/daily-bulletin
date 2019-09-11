package com.efe.nhhsbulletin.server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;

public class Server {

  public Server() {
    HttpServer server = null;
    try {
      server = HttpServer.create(new InetSocketAddress(8000), 0);
    } catch (IOException e) {
      e.printStackTrace();
      return;
    }
    ErrorHandler err = new ErrorHandler();
    server.createContext("/", err);
    server.createContext("/bulletin", new BulletinHandler(new BulletinManager(), err));
    server.setExecutor(null); // creates a default executor
    server.start();
  }

  private static class ErrorHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange t) throws IOException {
      String response = "404 not found";
      t.sendResponseHeaders(404, response.length());
      OutputStream out = t.getResponseBody();
      out.write(response.getBytes());
      out.close();
    }
  }

  private static class BulletinHandler implements HttpHandler {
    private final BulletinManager bulletinManager;
    private final ErrorHandler err;

    public BulletinHandler(BulletinManager bulletinManager, ErrorHandler err) {
      this.bulletinManager = bulletinManager;
      this.err = err;
    }

    @Override
    public void handle(HttpExchange t) throws IOException {
      System.out.println("Got req: " + t.getRequestURI().getPath());
      String reqName = t.getRequestURI().getPath();
      String response;
      if (reqName.equals("/bulletin/available_dates")) {
        response = bulletinManager.getAvailableDates();
      } else if (reqName.equals("/bulletin/date")) {
        response = bulletinManager.getDate();
      } else {
        err.handle(t);
        return;
      }
      t.sendResponseHeaders(200, response.length());
      OutputStream out = t.getResponseBody();
      out.write(response.getBytes());
      out.close();
    }
  }
}
