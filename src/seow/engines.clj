(ns seow.engines
	(:import [java.net URLDecoder]))

; engines
(def targets 
	{
	  :google
		{
		:base "https://www.google.co.jp/search?"
		:selector "cite"
		:query (fn[k] {"num" 20 "ie" "utf-8" "q" k})
		:clean (fn[e] (.replaceAll (.html e) "<b>|</b>" ""))
		}	
	  :yahoo
	  	{
	  	:base  "http://search.yahoo.co.jp/search?"
	  	:selector "li em"
	  	:query (fn[k] {"search.x" 1 "fr" "top_ga1_sa" "tid" "top_ga1_sa" "ei" "UTF-8" "p" k})
	  	:clean (fn[e] (.replaceAll (.html e) "<b>|</b>" ""))
	  	}
	   :bing
	    {
	    :base "http://www.bing.com/search?"
	    :query (fn[k]  {"x" 0 "y" 0 "form" "MSNH69" "qs" "n" "mkt" "ja-jp" "q" k})
	    :selector "h3 a"
	    :clean (fn[e] (.attr e "href"))
	    }
	    :goo 
	    {
	    :base "http://search.goo.ne.jp/web.jsp?"
	    :query (fn[k] {"MT" k "bt_search.x" 0 "bt_search.y" 0 "STYPE" "web" "SH" 1 "IE" "UTF-8" "OE" "UTF-8" "from" "gootop"})
	    :selector "a.g[target]"
	    :clean (fn[e] (.attr e "href"))
	    }
	    :fresheye  ; naver ;)
	    {
	    :base "http://search.fresheye.com/?"
	    :query (fn[k] {"kw" k "x" 0 "y" 0 "type" 1 "ord" "s" "rt" "web" "cs" "utf8"})
	    :selector "div.rslt p.title a"
	    :clean (fn[e] (URLDecoder/decode (last (re-find #"go=(.*)\&srch=" (.attr e "href"))) "UTF-8")) ; the href is encoded in a search query :(
		}
	}
)