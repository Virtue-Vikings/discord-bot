#!/bin/bash

# use `k get pods`
kubectl exec --stdin --tty $1 -- /bin/bash