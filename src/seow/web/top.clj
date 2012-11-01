(ns seow.web.top
	(:use noir.core)
	(:use seow.web.templates)
	(:require [seow.core :as seo])
	(:require [noir.response :as response])
	(:require [cheshire.custom :as json])
	(:require [seow.data.mongo :as data]))

; almost time for enlive
; https://github.com/cgrand/enlive/blob/master/examples/net/cgrand/enlive_html/examples.clj

; almost time for wijmo
; http://wijmo.com/demo/explore/?widget=Grid&sample=Data%20sources

; less templates 
; http://lesscss.org/

(json/add-encoder org.bson.types.ObjectId
             (fn [c jsonGenerator]
               (.writeString jsonGenerator (str c))))
(def jsonutf8 "application/json; charset=UTF-8")

; pages
(defpage "/welcome" []
	(main (welcome-template)))

(defpage "/new" []
	(main (new-template)))

(defpage "/chart" []
	(main (chart-template)))

; (defpage "/sites/list" []
; 	(apply str (listsites-template)))

; API
(defpage "/sites/:customerid" {:keys [customerid]}
	(response/content-type jsonutf8 
		(json/generate-string (data/find-websites customerid))))
(defpage "/filters/:wid" {:keys [wid]}
	(response/json (data/find-filtres wid)))
(defpage "/points/:fid" {:keys [fid]}
	(response/content-type jsonutf8 
		(json/generate-string (data/twoweeks fid))))