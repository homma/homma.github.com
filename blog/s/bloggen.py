#!/usr/bin/env python

# static blog page generator
# coding: utf-8

import sys
import os

# don't generate pyc file
sys.dont_write_bytecode = True

# read general settings
import config

# import markdown converter
# not necessary for now
#   (because github automatically convert .md to html and I will utilize it.)
# sys.path.append(config.MARKDOWN_PATH)
# import markdown

# read blog entries
sys.path.append(config.ARTICLE_PATH)
import article

# page template
import template

def erase_pages():
  parent_path = config.PAGE_PATH
  dirent = os.listdir(parent_path)
  for ent in dirent:
    path = parent_path + ent
    if os.path.isfile(path):
      # print "remove path " + path
      os.remove(path)

def gen_pages():
  max_entry = config.ENTRIES_PER_PAGE
  n_entries = len(article.entries)
  
  for n in range(n_entries):
    nth_page = (n / max_entry) + 1
    
    page_path = config.PAGE_PATH + str(nth_page) + '.html'
    f = open(page_path, 'a')
    
    # flag
    new_page = n % max_entry == 0
    
    # header
    if (new_page):
      t = template.header
      css_url = config.CSS_FILE
      s = t.format(css_url = css_url)
      f.write(s)
      
    # write entry
    t = template.entry
    s = t
    url = config.ARTICLE_PATH + article.entries[n][0]
    title = article.entries[n][1]
    date = article.entries[n][2]
    s = t.format(url = url, title = title, date = date)
    f.write(s)
    
    # flags
    last_entry_in_page = n % max_entry == max_entry - 1
    last_entry = n == n_entries - 1
    first_page = nth_page == 1
    
    # footer
    if last_entry_in_page or last_entry:
      t = template.footer
      if first_page:
        prev_link = "Prev"
      else:
        prev_url = config.ARTICLE_PATH + str(nth_page - 1) + '.html'
        prev_link = '<a href="' + prev_url + '">Prev</a>'
      if last_entry:
        next_link = "Next"
      else:
        next_url = config.ARTICLE_PATH + str(nth_page + 1) + '.html'
        next_link = '<a href="' + next_url + '">Next</a>'
      s = t.format(prev_link = prev_link, next_link = next_link)
      f.write(s)
    
    f.close()

def main():
  erase_pages()
  gen_pages()

if __name__ == '__main__':
  main()

