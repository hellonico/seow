(ns seow.web.top
	(:use noir.core)
	(:use [net.cgrand.enlive-html 
		:only [defsnippet deftemplate at content set-attr attr? strict-mode]])
	(:require [seow.core :as seo])
 	(:use [clojure.tools.logging :only (info error)])
	(:require [noir.response :as response])
	(:require [cheshire.custom :as json])
	(:require [seow.data.mongo :as data]))

(json/add-encoder org.bson.types.ObjectId
             (fn [c jsonGenerator]
               (.writeString jsonGenerator (str c))))

(defn json[result]
	(response/content-type "application/json; charset=UTF-8" 
		(json/generate-string result)))
(def JSON_OK (json "OK"))

; Enlive Templates
(deftemplate main 
	"seow/html/main.html" [])

; Pages
(defpage "/" []
	(main))

; API

(defpage "/sites/:customerid" {:keys [customerid]}
	(json (data/find-websites customerid)))

(defpage "/filters/:wid" {:keys [wid]}
	(json  (data/find-filtres wid)))
(defpage "/points/:fid" {:keys [fid]}
	(json (data/twoweeks fid)))

; not updating the data, but pulling new stats here
; maybe bad naming
(defpage "/site/update/:wid" {:keys [wid]}
	(seo/update-score wid)
	JSON_OK)

(defpage "/site/:wid" {:keys [wid]} 
	(json (data/find-website wid)))
(defpage [:post "/site"] {:as website}
	(data/update-or-new website)
	JSON_OK)
(defpage [:delete "/site/:wid"] {:keys [wid]}
	(data/delete-website wid)
	JSON_OK)