(ns seow.core
  (:use seow.engines)
  (:use jsoup.soup)
  (:use clojure.pprint)
  (:require [clj-http.client :as client]))

; http://www.blueglass.com/blog/google-search-url-parameters-query-string-anatomy/

;; should be somewhere else, (was in contrib, copy pasted it)
(defn indexed
  "Returns a lazy sequence of [index, item] pairs, where items come
  from 's' and indexes count up from zero.

  (indexed '(a b c d))  =>  ([0 a] [1 b] [2 c] [3 d])"
  [s]
  (map vector (iterate inc 1) s))

(defn positions
  "Returns a lazy sequence containing the positions at which pred
   is true for items in coll."
  [pred coll]
  (for [[idx elt] (indexed coll) :when (pred elt)] idx))

; constants
(def user-agent 
	"Mozilla/5.0 (Windows; U; WindowsNT 5.1; ja-JP; rv1.8.1.6) Gecko/20070725 Firefox/2.0.0.6")

; prepare the query string
(defn query-string[target words]
	(str (target :base) (client/generate-query-string ((target :query) words))))
; run the query
(defn run[target keywords]
 (client/get (query-string target keywords)
  {:client-params {"http.useragent" user-agent }}))
; suppose we have an answer with no error
(defn fetch[target keywords]
	((run target keywords) :body))
; turn answer into something ready to be parsed
(defn fetch-doc[target keywords]
	(parse (fetch target keywords)))
; apply selector and clean up each element found
(defn lookup[target docme]
	(map (target :clean) (select (target :selector) docme)))
; top method to execute a query with given keywords
(defn query[target keywords]
	(lookup target (fetch-doc target keywords)))
; position a site in a result set. returns a list of index matching the map	
(defn score[site result]
	(positions #{true} (pmap #(.contains % site) result)))
(defn scores[site keywords engines]
	(zipmap engines (pmap #(score site (query (targets %) keywords)) engines)))
(defn all-scores[site keywords]
	(scores site keywords (keys targets)))

; testing
(def target (ref (targets :fresheye)))

(defn q[keywords] (query @target keywords))
(defn p[keywords] (pprint (q keywords)))
(defn d[keywords] (fetch-doc @target keywords))
(defn p[keywords t] (pprint (query (targets t) keywords)))
(defn q[keywords t] (query (targets t) keywords))



; (score "www.nicotouchesthewalls.net" (q "nico" :bing))
; (all-scores "linkedin" "nicolas modrzyk")

; (generate-string (all-scores "linkedin" "nicolas modrzyk"))

; use google charts for the charts
; https://developers.google.com/chart/interactive/docs/queries

; Noir
; http://webnoir.org/

; ACTION