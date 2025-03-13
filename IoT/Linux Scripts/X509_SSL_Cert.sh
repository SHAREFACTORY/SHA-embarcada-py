#!/bin/bash
echo "X509 Certified Corno Creator"

sudo apt-get install openssl

openssl genrsa -out ca-key.pem 2048

openssl req -new -x509 -nodes \
   -key ca-key.pem \
   -out ca-cert.pem

openssl req -newkey rsa:2048 -nodes \
   -keyout server-key.pem \
   -out server-req.pem

openssl x509 -req -set_serial 01 \
   -in server-req.pem \
   -out server-cert.pem \
   -CA ca-cert.pem \
   -CAkey ca-key.pem \
   -extensions SAN   \
   -extfile <(printf "\n[SAN]\nsubjectAltName=DNS:host1.bastionxp.com\nextendedKeyUsage=serverAuth")

openssl req -newkey rsa:2048 -nodes \
   -keyout client-key.pem \
   -out client-req.pem

openssl x509 -req -set_serial 01  \
   -in client-req.pem    -out client-cert.pem  \
   -CA ca-cert.pem   \
   -CAkey ca-key.pem   \
   -extensions SAN  \
   -extfile <(printf "\n[SAN]\nsubjectAltName=DNS:host2.bastionxp.com\nextendedKeyUsage=clientAuth")

openssl x509 -in client-cert.pem -noout -text

echo "X509 Certified Corno Creator Finished This Shit"
