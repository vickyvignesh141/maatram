import mysql.connector
from pymongo import MongoClient

# ----------------------------
# 1. Connect to MySQL
# ----------------------------
mysql_conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Vicky@987",
    database="career_guidance"
)
cursor = mysql_conn.cursor(dictionary=True)

# ----------------------------
# 2. Connect to MongoDB
# ----------------------------
client = MongoClient("mongodb://localhost:27017/")
mongo_db = client["career_guidance_mongo"]   # MongoDB database name

# ----------------------------
# Function to migrate a table
# ----------------------------
def migrate_table(table_name):
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()

    if rows:
        collection = mongo_db[table_name]   # same name as MySQL table
        collection.insert_many(rows)
        print(f"✔ Migrated {len(rows)} rows from '{table_name}'")
    else:
        print(f"⚠ No data found in '{table_name}'")

# ----------------------------
# 3. Migrate both tables
# ----------------------------
migrate_table("users")
migrate_table("mentors")

print("🎉 Migration Completed Successfully!")
