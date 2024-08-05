from flask import Flask, jsonify, render_template
import sqlite3
import pandas as pd
from sqlalchemy import create_engine
    
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

'''This is the chart ofr the scatter plot '''
@app.route('/get-line')
def get_line():
    
        data = []
        '''the query gets the data and cleans it from the commas and $ and make it int'''

        query_scatter = ''' SELECT
        REPLACE(REPLACE([Total Sales], '$', ''), ',', '') AS TotalSales,
        REPLACE(REPLACE([Operating Profit], '$', ''), ',', '') AS OperatingProfit,
        REPLACE(REPLACE([Units Sold], '$', ''), ',', '') AS UnitsSold,
        City,
        Region
        FROM Addidas;

        '''
        query_regions = ''' select distinct Region 
        from Addidas
        '''
        df_scatter = pd.read_sql(query_scatter, engine)
        df_regions = pd.read_sql(query_regions, engine)
        data = []

        colors  = ["#67b7dc", "#9564db", "#c767dc", "#cdd3d9", "#6771dc"]
        dict_region = {}
        for region in df_regions['Region']:
            dict_region[region] = colors[len(dict_region) % len(colors)]

        for i in range(len(df_scatter)):
        
            data.append({ "title": df_scatter["City"][i], "color" : dict_region[df_scatter["Region"][i]],  "continent" : df_scatter["Region"][i],  "x": int(df_scatter["TotalSales"][i]), "y": int(df_scatter["OperatingProfit"][i]), "value": int(df_scatter["UnitsSold"][i])})


        return jsonify(data)
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

if __name__ == '__main__':
    app.run(debug=True)