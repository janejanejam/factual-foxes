import pandas as pd                        
from pytrends.request import TrendReq

import time
startTime = time.time()
pytrend = TrendReq(hl='en-US', tz=360)

import json
import csv
import os
import sys
import pymongo

def request_new_tree(user_input):

    # keyword_input = user_input
    keyword_df = [f'user_input']

    year = 2020
    starting_month = 6
    ending_month = 7

    timeframe_list = []

    ## Create list for date (Can not do future date) ---------------------------------------------------------------------------------
    for x in range(0, ending_month-starting_month):
        first_month = starting_month + x
        second_month = starting_month + x + 1
        if (second_month == 13): # End of the year replace the ending date with 12/31
            timeframe_temp = f'{year}-{first_month}-01 {year}-{first_month}-31'
        else:
            timeframe_temp = f'{year}-{first_month}-01 {year}-{second_month}-01'
        timeframe_list.append(timeframe_temp)

    ## Loop through the keyword list and date list ---------------------------------------------------------------------------------
    keyword_query_df = pd.DataFrame()

    keyword_hierarchical_list = [] 

    for x in range(0,len(keyword_df)):
        
        # Taking user input ---------------------------------------------------------------------------------------------------------
        keywords = [keyword_df[x]]
    
        for y in range(0, len(timeframe_list)):
            timeframe = timeframe_list[y]
            
            print(keywords[0])
            
            pytrend.build_payload(kw_list=keywords, cat=0, timeframe=timeframe, geo='US')

            related_queries_dict = pytrend.related_queries()
            query_top_df = pd.DataFrame(related_queries_dict[keywords[0]]['top'])
            
            print(related_queries_dict[keywords[0]]['top'])
            
            for index, row in query_top_df.iterrows():
                query_row = row['query']
    #             print(query_row.split(" ", 2))
    #             query_row.split(" ", 1)
                keyword_hierarchical_list.append(query_row.split(" ", 2))
        
            keyword_query_df = pd.DataFrame(keyword_hierarchical_list)
            
            keyword_query_df = keyword_query_df.sort_values(by=[0, 1])
            
    #         keyword_query_df.set_index([0, 1], inplace=True)
    #         keyword_query_df.sort_index(inplace=True)
            
            keyword_query_df = keyword_query_df.reset_index(drop=True)
    #         keyword_query_df['value'] = 0
            keyword_query_df = keyword_query_df.dropna()

    ## Create CSV for mongoDB ---------------------------------------------------------------------------------

    with open('/data/related_word.csv', 'a', newline='') as csvfile:
        obj = csv.writer(csvfile, quoting = csv.QUOTE_NONE, delimiter='|')
        obj.writerow(['id,value'])
        obj.writerow(['google,'])
        csvfile.close()

    with open('/data/related_word.csv', 'a', newline='') as csvfile:

        key_p_word = ''
        key_n_word = ''
        
        pervious_word = ''
        next_word = ''

        for index, row in keyword_query_df.iterrows():

            obj = csv.writer(csvfile, quoting = csv.QUOTE_NONE, delimiter='|')

            data_zero = row[0]
            data_one = row[1]
            data_two = row[2]

            strList = data_two.split()
            # Define a variable to store the converted string
            newString = ''
            # Iterate the list
            for val in strList:
            # Capitalize each list item and merge
                newString += val.capitalize()+ ' '
                newString = newString.replace(" ", "") 

                key_n_word = data_zero
                next_word = data_one

                if(key_p_word != key_n_word):
                    obj.writerow([f'google.{data_zero},'])
                    key_p_word = key_n_word
                    pervious_word = ''

                if(pervious_word != next_word):
                    obj.writerow([f'google.{data_zero}.{data_one},'])
                    obj.writerow([f'google.{data_zero}.{data_one}.{newString},0'])
                    pervious_word = next_word

                elif(pervious_word == next_word):
                    obj.writerow([f'google.{data_zero}.{data_one}.{newString},0'])
                    pervious_word = next_word

    csvfile.close()

    # import_content('/data/related_word.csv')


    return 

# def import_content(filepath):
#     mng_client = pymongo.MongoClient('localhost', 27017)
#     mng_db = mng_client['tree_data'] # Replace mongo db name
#     collection_name = 'tree_collection' # Replace mongo db collection name
#     db_cm = mng_db[collection_name]
#     cdir = os.path.dirname(__file__)
#     file_res = os.path.join(cdir, filepath)

#     data = pd.read_csv(file_res)
#     data_json = json.loads(data.to_json(orient='records'))
#     db_cm.remove()
#     db_cm.insert(data_json)

# if __name__ == "__main__":
#   filepath = '/path/to/csv/path'  # pass csv file path
#   import_content(filepath)