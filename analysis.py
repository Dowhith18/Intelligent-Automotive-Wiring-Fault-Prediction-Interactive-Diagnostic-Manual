from flask import render_template
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
from matplotlib.figure import Figure
import matplotlib.pyplot as plt
import numpy as np
from io import BytesIO
import base64


def generate_dashboard(trip_csv: str):
    """Handles data manipulation using pandas and creates all necessary charts using matplotlib

    Args:
        trip_csv (str): path to csv file

    Returns:
        Any: render_template with relevant fields
    """
    df = pd.read_csv(trip_csv)  # read csv and store as dataframe
    df = wrangle_df(df)  # handle raw data

    # extract trip information from dataset (distance, time, mpg, avg speed, fuel consumed)
    trip_info = get_trip_info(df)

    # plot all given charts
    rpm_img = plot_rpm(df['time'], df.get('Engine RPM (rpm)', pd.Series()))
    ideal_speed_img = plot_ideal_speed(df['time'], df.get('Vehicle speed (mph)', pd.Series()))
    acc_img = plot_acceleration(df["time"], df.get("Vehicle acceleration (g)", pd.Series()))
    rpm_throttle = hexbin_rpm_throttle(
        df.get("Engine RPM (rpm)", pd.Series()), 
        df.get("Throttle position (%)", pd.Series())
    )

    # return dashboard with generated charts as png
    return {
        'trip_info': trip_info,
        'rpm_img': rpm_img,
        'ideal_speed_img': ideal_speed_img,
        'acc_img': acc_img,
        'rpm_throttle': rpm_throttle
    }


def wrangle_df(df) -> pd.DataFrame:
    """Data wrangling: clean and transform the raw csv data

    Args:
        df (DataFrame): dataframe from input csv

    Returns:
        pd.DataFrame: cleaned up dataframe
    """
    # convert time to pandas datetime
    if 'time' in df.columns:
        df['time'] = pd.to_datetime(df['time'], format='mixed', errors='coerce')

    # remove any unnamed columns
    for col in df.columns:
        if 'Unnamed' in col:
            df.drop(col, axis=1, inplace=True)

    # forward fill
    df = df.ffill()

    # backward fill
    df = df.bfill()

    return df


def get_trip_info(df: pd.DataFrame) -> dict:
    """Extract trip information from dataframe (converted to Indian standards)

    Args:
        df (pd.DataFrame): Cleaned dataframe

    Returns:
        dict: Trip information in Indian units (km, km/l, liters)
    """
    trip_info = {}
    
    # Distance travelled - Convert miles to kilometers (1 mile = 1.60934 km)
    if 'Distance travelled (miles)' in df.columns:
        distance_miles = df['Distance travelled (miles)'].max()
        trip_info['distance'] = round(distance_miles * 1.60934, 2)
    else:
        trip_info['distance'] = 0
    
    # Trip duration
    if 'time' in df.columns:
        duration = (df['time'].max() - df['time'].min()).total_seconds() / 60
        trip_info['duration'] = round(duration, 1)
    else:
        trip_info['duration'] = 0
    
    # Average fuel efficiency - Convert MPG to km/l (1 MPG = 0.425144 km/l)
    if 'Average fuel consumption (MPG)' in df.columns:
        avg_mpg = df['Average fuel consumption (MPG)'].mean()
        trip_info['avg_kmpl'] = round(avg_mpg * 0.425144, 2)
    elif 'Average fuel consumption (total) (MPG)' in df.columns:
        avg_mpg = df['Average fuel consumption (total) (MPG)'].mean()
        trip_info['avg_kmpl'] = round(avg_mpg * 0.425144, 2)
    else:
        trip_info['avg_kmpl'] = 0
    
    # Average speed - Convert mph to km/h (1 mph = 1.60934 km/h)
    if 'Average speed (mph)' in df.columns:
        avg_speed_mph = df['Average speed (mph)'].mean()
        trip_info['avg_speed'] = round(avg_speed_mph * 1.60934, 2)
    elif 'Vehicle speed (mph)' in df.columns:
        avg_speed_mph = df['Vehicle speed (mph)'].mean()
        trip_info['avg_speed'] = round(avg_speed_mph * 1.60934, 2)
    else:
        trip_info['avg_speed'] = 0
    
    # Fuel consumed - Convert gallons to liters (1 gallon = 3.78541 liters)
    if 'Fuel used (gallon)' in df.columns:
        fuel_gallons = df['Fuel used (gallon)'].max()
        trip_info['fuel_consumed'] = round(fuel_gallons * 3.78541, 2)
    elif 'Fuel used (total) (gallon)' in df.columns:
        fuel_gallons = df['Fuel used (total) (gallon)'].max()
        trip_info['fuel_consumed'] = round(fuel_gallons * 3.78541, 2)
    else:
        trip_info['fuel_consumed'] = 0
    
    return trip_info


def plot_rpm(x: pd.Series, y: pd.Series) -> str:
    """Plot Engine RPM over time

    Args:
        x (pd.Series): Time series
        y (pd.Series): Engine RPM

    Returns:
        str: Base64 encoded image
    """
    if y.empty or y.isna().all():
        return generate_empty_chart("No RPM data available")
    
    fig = Figure(figsize=(10, 6))
    ax = fig.subplots()
    
    # Plot RPM
    ax.plot(x, y, color='#3b82f6', linewidth=2)
    
    # Add ideal RPM zones
    ax.axhspan(0, 1500, alpha=0.2, color='green', label='Idle Zone')
    ax.axhspan(1500, 3000, alpha=0.2, color='yellow', label='Optimal Zone')
    ax.axhspan(3000, y.max() + 500, alpha=0.2, color='red', label='High RPM Zone')
    
    ax.set_xlabel('Time', fontsize=12)
    ax.set_ylabel('Engine RPM', fontsize=12)
    ax.set_title('Engine RPM Over Time', fontsize=14, fontweight='bold')
    ax.legend(loc='upper right')
    ax.grid(True, alpha=0.3)
    
    # Format x-axis for time
    fig.autofmt_xdate()
    
    return generate_image(fig)


def plot_ideal_speed(x: pd.Series, y: pd.Series) -> str:
    """Plot vehicle speed over time with speed zones (converted to km/h)

    Args:
        x (pd.Series): Time series
        y (pd.Series): Vehicle speed in mph (will be converted to km/h)

    Returns:
        str: Base64 encoded image
    """
    if y.empty or y.isna().all():
        return generate_empty_chart("No speed data available")
    
    # Convert mph to km/h (1 mph = 1.60934 km/h)
    y_kmh = y * 1.60934
    
    fig = Figure(figsize=(10, 6))
    ax = fig.subplots()
    
    # Plot speed
    ax.plot(x, y_kmh, color='#10b981', linewidth=2)
    
    # Add speed zones in km/h (converted from mph zones)
    ax.axhspan(0, 40, alpha=0.2, color='yellow', label='Low Speed Zone')
    ax.axhspan(40, 88, alpha=0.2, color='green', label='Optimal Zone')
    ax.axhspan(88, 120, alpha=0.2, color='orange', label='High Speed Zone')
    if y_kmh.max() > 120:
        ax.axhspan(120, y_kmh.max() + 8, alpha=0.2, color='red', label='Very High Speed')
    
    ax.set_xlabel('Time', fontsize=12)
    ax.set_ylabel('Speed (km/h)', fontsize=12)
    ax.set_title('Vehicle Speed Over Time', fontsize=14, fontweight='bold')
    ax.legend(loc='upper right')
    ax.grid(True, alpha=0.3)
    
    # Format x-axis for time
    fig.autofmt_xdate()
    
    return generate_image(fig)


def plot_acceleration(x: pd.Series, y: pd.Series) -> str:
    """Plot vehicle acceleration over time

    Args:
        x (pd.Series): Time series
        y (pd.Series): Vehicle acceleration (g)

    Returns:
        str: Base64 encoded image
    """
    if y.empty or y.isna().all():
        return generate_empty_chart("No acceleration data available")
    
    fig = Figure(figsize=(10, 6))
    ax = fig.subplots()
    
    # Plot acceleration
    colors = ['red' if val < -0.2 else 'orange' if val > 0.3 else 'green' for val in y]
    ax.scatter(x, y, c=colors, alpha=0.6, s=10)
    
    # Add reference lines
    ax.axhline(y=0, color='black', linestyle='-', linewidth=1, label='Neutral')
    ax.axhline(y=0.3, color='orange', linestyle='--', linewidth=1, label='Hard Acceleration')
    ax.axhline(y=-0.2, color='red', linestyle='--', linewidth=1, label='Hard Braking')
    
    ax.set_xlabel('Time', fontsize=12)
    ax.set_ylabel('Acceleration (g)', fontsize=12)
    ax.set_title('Vehicle Acceleration Over Time', fontsize=14, fontweight='bold')
    ax.legend(loc='upper right')
    ax.grid(True, alpha=0.3)
    
    # Format x-axis for time
    fig.autofmt_xdate()
    
    return generate_image(fig)


def hexbin_rpm_throttle(x: pd.Series, y: pd.Series) -> str:
    """Create hexbin plot of RPM vs Throttle Position

    Args:
        x (pd.Series): Engine RPM
        y (pd.Series): Throttle position (%)

    Returns:
        str: Base64 encoded image
    """
    if x.empty or y.empty or x.isna().all() or y.isna().all():
        return generate_empty_chart("No RPM/Throttle data available")
    
    fig = Figure(figsize=(10, 6))
    ax = fig.subplots()
    
    # Create hexbin plot
    hexbin = ax.hexbin(x, y, gridsize=30, cmap='YlOrRd', mincnt=1)
    
    ax.set_xlabel('Engine RPM', fontsize=12)
    ax.set_ylabel('Throttle Position (%)', fontsize=12)
    ax.set_title('Engine RPM vs Throttle Position', fontsize=14, fontweight='bold')
    
    # Add colorbar
    cb = fig.colorbar(hexbin, ax=ax)
    cb.set_label('Frequency', fontsize=10)
    
    ax.grid(True, alpha=0.3)
    
    return generate_image(fig)


def generate_image(fig) -> str:
    """Convert matplotlib figure to base64 encoded string

    Args:
        fig: Matplotlib figure

    Returns:
        str: Base64 encoded image string
    """
    buf = BytesIO()
    fig.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='white')
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()
    plt.close(fig)
    return f"data:image/png;base64,{img_str}"


def generate_empty_chart(message: str) -> str:
    """Generate an empty chart with a message

    Args:
        message (str): Message to display

    Returns:
        str: Base64 encoded image string
    """
    fig = Figure(figsize=(10, 6))
    ax = fig.subplots()
    ax.text(0.5, 0.5, message, ha='center', va='center', fontsize=14, color='gray')
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    return generate_image(fig)
