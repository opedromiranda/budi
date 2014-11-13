#!/bin/sh

FILES=./vhosts/*
for f in $FILES
do
  fn=$(basename $f)
  cp $f /etc/nginx/sites-available/$fn
  ngxen $fn
  rm /etc/nginx/sites-enabled/$fn
  ln -s /etc/nginx/sites-available/$fn /etc/nginx/sites-enabled/$fn
done

FILES=./init/*
for f in $FILES
do
  fn=$(basename $f)
  cp $f /etc/init/$fn
done

sudo service nginx restart
