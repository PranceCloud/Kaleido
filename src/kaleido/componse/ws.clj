<<<<<<< HEAD
;(ns kaleido.componse.ws
;  (:require [compojure.core :refer [GET defroutes wrap-routes]]
;            [clojure.tools.logging :as log]
;            [immutant.web.async :as async]))
;
;(defonce channels (atom #{}))
;
;(defn notify-clients! [channel msg]
;  (doseq [channel @channels]
;    (async/send! channel msg)))
;
;(defn connect! [channel]
;  (log/info "channel open")
;  (swap! channels conj channel))
;
;(defn disconnect! [channel {:keys [code reason]}]
;  (log/info "close code:" code "reason:" reason)
;  (swap! channels #(remove #{channel} %)))
;
;(def websocket-callbacks
;  "WebSocket callback functions"
;  {:on-open    connect!
;   :on-close   disconnect!
;   :on-message notify-clients!})
;
;(defn ws-handler [request]
;  (async/as-channel request websocket-callbacks))
;
;(defroutes websocket-routes
=======
;(ns kaleido.componse.ws
;  (:require [compojure.core :refer [GET defroutes wrap-routes]]
;            [clojure.tools.logging :as log]
;            [immutant.web.async :as async]))
;
;(defonce channels (atom #{}))
;
;(defn notify-clients! [channel msg]
;  (doseq [channel @channels]
;    (async/send! channel msg)))
;
;(defn connect! [channel]
;  (log/info "channel open")
;  (swap! channels conj channel))
;
;(defn disconnect! [channel {:keys [code reason]}]
;  (log/info "close code:" code "reason:" reason)
;  (swap! channels #(remove #{channel} %)))
;
;(def websocket-callbacks
;  "WebSocket callback functions"
;  {:on-open    connect!
;   :on-close   disconnect!
;   :on-message notify-clients!})
;
;(defn ws-handler [request]
;  (async/as-channel request websocket-callbacks))
;
;(defroutes websocket-routes
>>>>>>> 12fa5dab22f60feb5ea0a9495816cfe6c11acf0d
;           (GET "/ws" [] ws-handler))