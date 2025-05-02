import hashlib

password_a = "abcd"
print(hashlib.sha256(password_a.encode("utf-8")).hexdigest())

print(hashlib.sha256(password_a.encode("utf-8")).hexdigest())

password_b = "XASDasdasdas_asdasdasd"
print(hashlib.sha256(password_b.encode("utf-8")).hexdigest())