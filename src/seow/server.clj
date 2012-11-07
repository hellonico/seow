(ns seow.server
	(:use [noir.server.handler :only [add-custom-middleware]])
    (:use [ring.middleware.file :only [wrap-file]])
    (:require [noir.server :as server]))

(server/load-views-ns 'seow.web.top)

(defn -main [& m]
  (let [mode (keyword (or (first m) :dev))
        port (Integer. (get (System/getenv) "PORT" "8080"))]
    (add-custom-middleware wrap-file "public")
    (server/start port {:mode mode :ns 'seow})))