from flask import Flask, jsonify, render_template
import sqlite3
import pandas as pd
from sqlalchemy import create_engine
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
from sklearn.linear_model import LinearRegression
    
def create_connection(db_file):
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as ex:
        print(ex)
    return conn

#initilaize th database
df = pd.read_csv(r"C:\\Dahdouha\\Third Semester - Year 2\\Data Vizualization\\Final Project\\Adidas US Sales Datasets.csv")
connection = create_connection("demo.db")
df.to_sql("Addidas", connection, if_exists="replace")
connection.close()

db_url = 'sqlite:///demo.db'
engine = create_engine(db_url, echo=False)
df_2 = pd.read_sql('select * from Addidas', engine)
df_3 = pd.read_sql('select [Sales Method], Retailer, [Operating Profit] from Addidas', engine)
df_line = pd.read_csv("output.csv")
result = df_line.to_dict(orient='records')
print(result)

app = Flask(__name__)

@app.route('/')


def index():
    return render_template("index.html")

#this is the 
'''This is the grouped bar this gives me the profit of each retailer in each sales method'''
@app.route('/get-data')
def get_data():
   
    data = []
    query_get_data = ''' select distinct [Sales Method] 
    from Addidas
    '''
    query_get_data_2 = ''' select distinct Retailer 
    from Addidas
    '''
    query_get_data_3 = ''' SELECT [Sales Method], Retailer, SUM(CAST(REPLACE(REPLACE([Operating Profit], '$', ''), ',', '') AS INT)) As Summ
    FROM Addidas
    Group by [Sales Method], Retailer'''
    df_4 = pd.read_sql(query_get_data, engine)
    df_5 = pd.read_sql(query_get_data_3, engine)
    df_6 = pd.read_sql(query_get_data_2, engine)
    data = []
    for i in range(len(df_4)):
        data.append({"Method" : df_4['Sales Method'][i]})


    for i in range(len(df_5)):
        for j in range(len(data)):
            if data[j]['Method'] == df_5.loc[i]["Sales Method"]:
             data[j][df_5["Retailer"][i]] = int(df_5["Summ"][i])   
    return jsonify(data)
@app.route('/get-retailer')
def get_retailer():
    df['Invoice Date'] = pd.to_datetime(df['Invoice Date'], format='%d/%m/%Y')

# Convert 'Total Sales' to float
    df['Total Sales'] = df['Total Sales'].str.replace('$', '').str.replace(',', '').astype(float)

    # Add a column for the quarter and year
    df['Year'] = df['Invoice Date'].dt.year
    annual_sales = df.groupby(['Year', 'Retailer'])['Total Sales'].sum().reset_index()

    # Pivot the data to get a matrix where rows are years and columns are retailers
    pivot_df = annual_sales.pivot_table(index='Year', columns='Retailer', values='Total Sales', fill_value=0)

    # Convert to the desired format
    result = []
    for year, row in pivot_df.iterrows():
        entry = {'year': str(year)}
        for col in pivot_df.columns:
            entry[col] = round(row[col] / 1000, 1)  # Convert to thousands for easier reading
        result.append(entry)
    return jsonify(result)

   

'''This is the chart ofr the scatter plot '''
@app.route('/get-line')
def get_line():
    df_line = pd.read_csv("output.csv")
    result = df_line.to_dict(orient='records')

    return jsonify(result)
# '''This is the chart ofr the scatter plot '''
# @app.route('/get-scatter')
# def get_scatter():
    
#         data = []
#         '''the query gets the data and cleans it from the commas and $ and make it int'''

#         query_scatter = ''' SELECT
#         REPLACE(REPLACE([Total Sales], '$', ''), ',', '') AS TotalSales,
#         REPLACE(REPLACE([Operating Profit], '$', ''), ',', '') AS OperatingProfit,
#         REPLACE(REPLACE([Units Sold], '$', ''), ',', '') AS UnitsSold,
#         City,
#         Region
#         FROM Addidas;

#         '''
#         query_regions = ''' select distinct Region 
#         from Addidas
#         '''
#         df_scatter = pd.read_sql(query_scatter, engine)
#         df_regions = pd.read_sql(query_regions, engine)
#         data = []

#         colors  = ["#67b7dc", "#9564db", "#c767dc", "#cdd3d9", "#6771dc"]
#         dict_region = {}
#         for region in df_regions['Region']:
#             dict_region[region] = colors[len(dict_region) % len(colors)]

#         for i in range(len(df_scatter)):
        
#             data.append({ "title": df_scatter["City"][i], "color" : dict_region[df_scatter["Region"][i]],  "continent" : df_scatter["Region"][i],  "x": int(df_scatter["TotalSales"][i]), "y": int(df_scatter["OperatingProfit"][i]), "value": int(df_scatter["UnitsSold"][i])})


#         return jsonify(data)
@app.route('/get-product')
def get_product():
    top_products_per_retailer = df.loc[df.groupby('Retailer')['Total Sales'].idxmax()]
    grouped = top_products_per_retailer.groupby(['Retailer', 'Product']).agg({'Units Sold': 'sum'}).reset_index()
    sorted_df = grouped.sort_values(['Retailer', 'Units Sold'], ascending=[True, False])
    grouped = top_products_per_retailer.groupby(['Retailer', 'Product']).agg({'Units Sold': 'sum'}).reset_index()
    list_of_products = ["static\Women_Daily-removebg-preview.png", "static\Men_apparel-removebg-preview.png", "static\Women_Daily-removebg-preview.png", "static\images-removebg-preview.png", "static\Women_Daily-removebg-preview.png", "static\images-removebg-preview.png"]
    # Sort by 'Retailer' and 'Units Sold' within each retailer
    sorted_df = grouped.sort_values(['Retailer', 'Units Sold'], ascending=[True, False])

    # Create a dictionary to map each retailer to their top product's units sold
    top_products = []
    i = 0
    for retailer, group in sorted_df.groupby('Retailer'):
        top_product = group.iloc[0]
        top_products.append({
            "name": retailer,
            "value": int(top_product["Units Sold"]),
            "bulletSettings": { "src": list_of_products[i] }  # Placeholder image URL
        }) 
        i+=1
    return jsonify(top_products)
'''Pie Chart "Dounut" To get which retailer give me the most products? '''
@app.route('/get-pie')
def get_pie():

    query = """
    SELECT DISTINCT Retailer , COUNT(*) as value
    FROM Addidas
    GROUP BY Retailer
    """
    df_4 = pd.read_sql(query, engine)
    data = []
    for i in range(len(df_4)):
        data.append({"class": df_4["Retailer"][i], "value":int(df_4["value"][i])})
    return jsonify(data)

'''This is the code for the map i made a query to get the total sales and cleans it from commas and $ and make it int'''
@app.route('/get-new')
def get_map():
    data = []
    query_map = ''' select State, REPLACE(REPLACE([Total Sales], '$', ''), ',', '') AS TotalSales
    from Addidas'''

    df_map = pd.read_sql(query_map, engine)
    '''This function generates the ids for each state because they are not presented in the data provided'''
    def generate_city_abbreviations(cities):
            city_abbreviations = {}
            for city in cities:
                words = city.split()
                if len(words) == 2:
                    abbreviation = ''.join(word[:1].upper() for word in words)
                else:
                    abbreviation = ''.join(word[:2].upper() for word in words)
                city_abbreviations[city] = "US-" + abbreviation
            city_abbreviations["Texas"] = "US-TX"
            city_abbreviations["Mississippi"] = "US-MS"
            city_abbreviations["Montana"] = "US-MT"
            city_abbreviations["Arizona"] = "US-AZ"
            city_abbreviations["Kansas"] = "US-KS"
            city_abbreviations["Connecticut"] = "US-CT"
            city_abbreviations["Kentucky"] = "US-KY"
            city_abbreviations["Missouri"] = "US-MO"
            city_abbreviations["Iowa"] = "US-IA"
            city_abbreviations["Minnesota"] = "US-MN"
            city_abbreviations["Georgia"] = "US-GA"
            city_abbreviations["Virginia"] = "US-VA"
            city_abbreviations["Tennessee"] = "US-TN"
            city_abbreviations["Pennsylvania"] = "US-PA"
            city_abbreviations["Vermont"] = "US-VT"
            city_abbreviations["Maine"] = "US-ME"
            city_abbreviations["Maryland"] = "US-MD"
            city_abbreviations["Louisiana"] = "US-LA"
            city_abbreviations["Nevada"] = "US-NV"

            
            return city_abbreviations

    list_of_cities = df_2["State"].unique()
    city_abbreviations = generate_city_abbreviations(list_of_cities)
  
    index = 0

    c = 0
    while index < len(df_map):
        total_sales = 0
        country = " "
        
        if index < len(df_map):
            country = df_map["State"][index]

            while index < len(df_map) and df_map["State"][index] == country:
            
                total_sales += int(df_map["TotalSales"][index])
                index += 1
            existing_entry = next((entry for entry in data if entry["id"] == city_abbreviations[country]), None)
            if existing_entry:
                existing_entry["value"] += total_sales
            else:
                data.append({"id": city_abbreviations[country], "value": total_sales})
                c += 1
    return jsonify(data)


# @app.route('/get-Add')
# def get_Add():
#     df['Total Sales'] = pd.to_numeric(df['Total Sales'].replace({'\$': '', ',': ''}, regex=True), errors='coerce')

#     # Sort the DataFrame by 'Total Sales' in descending order
#     df_sorted = df.sort_values(by='Total Sales', ascending=False)

#     # Select the top 7 states
#     top_7_states = df_sorted.head(7)

#     # Format the data as a list of dictionaries
#     data = [
#         {"value": row['Total Sales'], "category": row['State']}
#         for _, row in top_7_states.iterrows()
#     ]
    
#     # Return the data as a JSON response
#     return jsonify(data)

#     return data
'''This is the stacked bar that give me information about the region with the highest profit in each region with each sales method'''
@app.route('/get-profit')
def get_profit():
    
    data = []

    query_5 = ''' select [Sales Method], Region , Count([Sales Method]) AS Count
    from addidas
    Group by [Sales Method],  Region
    '''
    query_get_data_7 = ''' select distinct [Sales Method] 
    from Addidas
    '''
 
    df_profit = pd.read_sql(query_5, engine)
    df_profit_1 = pd.read_sql(query_get_data_7, engine)


    for i in range(len(df_profit_1)):
        data.append({"class" : df_profit_1['Sales Method'][i]})

    for i in range(len(df_profit)):
        for j in range(len(data)):
            if data[j]["class"] == df_profit.loc[i]["Sales Method"]:
                data[j][df_profit.loc[i]["Region"]] = int(df_profit.loc[i]["Count"])

   
  
    return jsonify(data)
@app.route('/get-total-sales')
def get_total_sales():
    query = '''
    SELECT SUM(CAST(REPLACE(REPLACE([Total Sales], '$', ''), ',', '') AS FLOAT)) AS TotalSales
    FROM Addidas
    '''
    df_total_sales = pd.read_sql(query, engine)
    total_sales = df_total_sales['TotalSales'][0]
    return jsonify({"total_sales": round(total_sales / 1000, 2)})  # Return in thousands, rounded to 2 decimal places
@app.route('/get-operating-profit')
def get_operating_profit():
    query = '''
    SELECT SUM(CAST(REPLACE(REPLACE([Operating Profit], '$', ''), ',', '') AS FLOAT)) AS OperatingProfit
    FROM Addidas
    '''
    df_operating_profit = pd.read_sql(query, engine)
    operating_profit = df_operating_profit['OperatingProfit'][0]
    return jsonify({"operating_profit": round(operating_profit / 1000, 2)})  # Return in thousands, rounded to 2 decimal places

@app.route('/get-units-sold')
def get_units_sold():
    query = '''
    SELECT SUM(CAST(REPLACE(REPLACE([Units Sold], '$', ''), ',', '') AS FLOAT)) AS UnitsSold
    FROM Addidas
    '''
    df_units_sold = pd.read_sql(query, engine)
    units_sold = df_units_sold['UnitsSold'][0]
    return jsonify({"units_sold": units_sold})  # Return in thousands, rounded to 2 decimal places



if __name__ == '__main__':
    app.run(debug=True)