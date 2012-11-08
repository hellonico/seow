(ns seow.web.top
	(:use noir.core)
	(:use [net.cgrand.enlive-html 
		:only [defsnippet deftemplate at content set-attr attr? strict-mode]])
	(:require [seow.core :as seo])
	(:require [noir.response :as response])
	(:require [cheshire.custom :as json])
	(:require [seow.data.mongo :as data]))

(json/add-encoder org.bson.types.ObjectId
             (fn [c jsonGenerator]
               (.writeString jsonGenerator (str c))))

(defn json[result]
	(response/content-type "application/json; charset=UTF-8" 
		(json/generate-string result)))

; Enlive Templates
(deftemplate main 
	"seow/html/main.html" [])

; pages
(defpage "/" []
	(main))

; API
(defpage "/sites/:customerid" {:keys [customerid]}
	(json (data/find-websites customerid)))
(defpage "/site/:wid" {:keys [wid]} 
	(response/content-type jsonutf8 
		(json/generate-string (data/find-website wid))))
(defpage "/filters/:wid" {:keys [wid]}
	(response/content-type jsonutf8 
		(json/generate-string (data/find-filtres wid))))
(defpage "/points/:fid" {:keys [fid]}
	(response/content-type jsonutf8 
		(json/generate-string (data/twoweeks fid))))