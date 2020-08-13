import json

import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output
import plotly.express as px
import pandas as pd
import plotly.graph_objects as go

from sqlalchemy import create_engine
engine = create_engine("postgresql://postgres:Newidea88@localhost/statekeyword_db")
con = engine.connect()

df = pd.read_sql('SELECT * FROM keywords', con).set_index('index')

keywords = df['keyword'].unique()

external_stylesheets = ['https://codepen.io/chriddyp/pen/bWLwgP.css']

app = dash.Dash(__name__, external_stylesheets=external_stylesheets)

styles = {
    'pre': {
        'border': 'thin lightgrey solid',
        'overflowX': 'scroll'
    }
}


#df = pd.read_csv('https://raw.githubusercontent.com/plotly/datasets/master/2011_us_ag_exports.csv')

dropdown = [{'label': x, 'value': x} for x in keywords]

app.layout = html.Div([
    dcc.Dropdown(
        id='demo-dropdown',
        options=dropdown,
        value=dropdown[0]['value']
    ),
    dcc.Graph( id='chart', animate=True  )
    
])

@app.callback(
    dash.dependencies.Output('chart', 'figure'),
    [dash.dependencies.Input('demo-dropdown', 'value')])
def update_output(value):
    print(value)
    selected = df[df['keyword'] == value]
    print(selected)
    fig = go.Figure(data=go.Choropleth(
        locations=selected['state'], # Spatial coordinates
        z = selected['value'].astype(float), # Data to be color-coded
        locationmode = 'USA-states', # set of locations match entries in `locations`
        colorscale = 'Reds',
        colorbar_title = "Google Trend",
    ))

    fig.update_layout(
        title_text = 'Google Pytends Kewords by State',
        geo_scope='usa', # limite map scope to USA
    )

    return fig


if __name__ == '__main__':
    app.run_server(debug=True)