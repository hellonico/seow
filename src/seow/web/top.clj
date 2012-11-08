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

; Pages
(defpage "/" []
	(main))

; API
(defpage "/sites/:customerid" {:keys [customerid]}
	(json (data/find-websites customerid)))
(defpage "/site/:wid" {:keys [wid]} 
	(json (data/find-website wid)))
(defpage "/filters/:wid" {:keys [wid]}
	(json  (data/find-filtres wid)))
(defpage "/points/:fid" {:keys [fid]}
	(json (data/twoweeks fid)))
(defpage "/site/update/:wid" {:keys [wid]}
	(seo/update-score wid)
	(json "OK"))