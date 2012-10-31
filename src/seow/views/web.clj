(ns seow.views.web
	(:use noir.core)
	(:require [seow.core :as seo])
	(:require [noir.response :as response])
	(:require [cheshire.custom :as json2])
	(:require [seow.data.mongo :as data])
	(:use [net.cgrand.enlive-html :as html :only [deftemplate at content set-attr attr? strict-mode]] :reload)
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

(deftemplate welcome-template
	"seow/html/welcome.html"
	[title]
	[:title] (content title))

(defpage "/welcome" []
	(apply str (welcome-template "Hello user!")))

(defpage "/sites/:customerid" {:keys [customerid]}
	(response/content-type jsonutf8 (json2/generate-string (data/find-websites customerid))))

(defpage "")
	
(defpage "/myfilters/:wid" {:keys [wid]}
	(response/json (data/find-filtres wid)))

