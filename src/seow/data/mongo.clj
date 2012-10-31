(ns seow.data.mongo
 (:import [org.joda.time DateTime])
 (:import org.bson.types.ObjectId)
 (:require [clojure.data.json :as json])
 (:use monger.operators)
 (:use [clojure.tools.logging :only (info error)])
 (:require [monger.joda-time])
 (:require [monger.collection :as mc])
 (:require [monger.core :as mg]))

; http://localhost:28017/mydb/

; records 
(defrecord website [customer nom urls])
(defrecord filtre [siteid keywords])
(defrecord entry [filtreid date values])

; connection set up
(def conn  (mg/connect! { :host "127.0.0.1" :port 27017 }))
(mg/set-db! (mg/get-db "mydb"))

; clean
(defn clean-mess[]
	(mc/remove :seo)
	(mc/remove :websites))
(defn delete[type id]
	(mc/remove type id))

; website
(defn new-website[customer sitename urls]
	(mc/insert-and-return :websites (website. customer sitename urls)))
(defn find-websites[customer]
	(mc/find-maps :websites {:customer customer}))
(defn find-website[id]
	(mc/find-one-as-map :websites {:_id (ObjectId. id)}))

; filters 
(defn new-filtre[siteid keywords]
	(mc/insert :filters (filtre. siteid keywords)))
(defn find-filtres[siteid]
	(mc/find-maps :filters {:siteid siteid}))

; seo entries
(defn new-entry[filtreid values]
	(info "NEW" filtreid values)
	(mc/insert :seo (entry. filtreid (DateTime/now) values)))
(defn find-entries
	([date-start date-end]
	(mc/find-maps :seo {:date {"$gt" date-start "$lte" date-end}}))
	([date-start]
		(mc/find-maps :seo {:date {"$gt" date-start}})))	

; shortcuts
(defn yesterday[]
	(find-entries (.minusDays (DateTime/now) 1) (.minusDays (DateTime/now) 2) ))
(defn today[] 
	(find-entries (.minusDays (DateTime/now) 1) ))