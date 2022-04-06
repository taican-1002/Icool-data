from flask import Flask, request
app = Flask(__name__)
import requests
import pandas as pd
import random

def get_date(date1, date2, CH):
    print(f'==> store: {CH}')
    dates=[str(x).split()[0] for x in pd.date_range(date1, date2, freq='D')]
    output={}
    for x in dates:
        output[x]=random.randint(20, 200)
    return output


@app.route('/predict', methods=['POST'])
def welcome():
    data = eval(request.data)
    print(f'==> data: {data}')
    date1=data['date1']
    date2=data['date2']
    CH=data['CH']

    return get_date(date1, date2, CH)


if __name__ == '__main__':
    app.run()


