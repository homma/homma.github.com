# page template
# coding-utf-8

header = '''\
<meta charset=utf-8>
<link rel="stylesheet" href="{css_url}" type="text/css" />
<script type="text/javascript" src="{script_url}"></script>
'''

entry = '''\
<div class="blog_entry">
  <div class="blog_title">{title}</div>
  <iframe id="{id}" src="{url}" class="blog_frame" onload=adjust_iframe("{id}")
     ></iframe>
  <div class="blog_footer">
    <span>posted on </span>
    <span class="blog_date">{date}.</span>
    <span class="blog_link"><a href="{url}">permalink</a></span>
  </div>
</div>
'''

footer= '''\
<div class="page_footer">
  <span>{prev_link}</span> | <span>{next_link}</span>
</div>
'''
