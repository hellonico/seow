(ns seow.views.web
	(:use noir.core)
	(:require [seow.core :as seo])
	(:require [noir.response :as response])
	(:require [cheshire.custom :as json2])
	(:require [seow.data.mongo :as data])
	(:use [net.cgrand.enlive-html :as html :only [defsnippet deftemplate at content set-attr attr? strict-mode]] :reload)
  	(:require [noir.server :as server]))

; almost time for enlive
; https://github.com/cgrand/enlive/blob/master/examples/net/cgrand/enlive_html/examples.clj

; almost time for wijmo
; http://wijmo.com/demo/explore/?widget=Grid&sample=Data%20sources

; less templates 
; http://lesscss.org/

(json2/add-encoder org.bson.types.ObjectId
             (fn [c jsonGenerator]
               (.writeString jsonGenerator (str c))))
(def jsonutf8 "application/json; charset=UTF-8")

(deftemplate main "seow/html/main.html"
	[body]
	[:body] (content body))

(defsnippet welcome-template "seow/html/welcome.html" [:body]  [])
(defsnippet new-template "seow/html/new.html" [:body] [])

(deftemplate google-template "seow/html/google.html"
	[])

(defpage "/welcome" []
	(main (welcome-template)))

(defpage "/new" []
	(main (new-template)))


(defpage "/sites/:customerid" {:keys [customerid]}
	(response/content-type jsonutf8 (json2/generate-string (data/find-websites customerid))))

(defpage "/google" []
	(apply str (google-template)))

(defpage "/sites/list" []
	(apply str (listsites-template)))
	
(defpage "/myfilters/:wid" {:keys [wid]}
	(response/json (data/find-filtres wid)))