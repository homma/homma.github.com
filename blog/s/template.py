# page template

header = '''\
<meta charset=utf-8>
<link rel="stylesheet" href="{css_url}" type="text/css" />
'''

entry = '''\
<div class="blog_entry">
  <div class="blog_title">{title}</div>
  <iframe src={url} class="blog_frame"></iframe>
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
