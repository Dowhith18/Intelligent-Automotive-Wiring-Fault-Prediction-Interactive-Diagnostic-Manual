import base64
from io import BytesIO

import matplotlib
import matplotlib.dates as mdates
from matplotlib.figure import Figure
import matplotlib.pyplot as plt
import pandas as pd

matplotlib.use('Agg')  # Use non-interactive backend


def generate_dashboard(trip_csv: str):
    """Handles data manipulation using pandas and creates all necessary charts using matplotlib.

    Args:
        trip_csv (str): Path to CSV file.

    Returns:
        dict: Trip data containing trip info and base64 images for charts.
    """
    df = pd.read_csv(trip_csv)
    df = wrangle_df(df)

    trip_info = get_trip_info(df)

    time_series = df.get('time', pd.Series(dtype='datetime64[ns]'))
    rpm_series = df.get('Engine RPM (rpm)', pd.Series(dtype=float))
    speed_series = df.get('Vehicle speed (mph)', pd.Series(dtype=float))
    accel_series = df.get('Vehicle acceleration (g)', pd.Series(dtype=float))
    throttle_series = df.get('Throttle position (%)', pd.Series(dtype=float))

    rpm_img = plot_rpm(time_series, rpm_series)
    ideal_speed_img = plot_ideal_speed(time_series, speed_series)
    acc_img = plot_acceleration(time_series, accel_series)
    rpm_throttle = hexbin_rpm_throttle(rpm_series, throttle_series)

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
        df['time'] = pd.to_datetime(df['time'], errors='coerce')

    # remove any unnamed columns
    for col in list(df.columns):
        if 'Unnamed' in col:
            df.drop(col, axis=1, inplace=True)

    # forward/backward fill for missing values
    df = df.ffill().bfill()

    return df


def get_trip_info(df: pd.DataFrame) -> dict:
    """Extract trip information from dataframe (converted to Indian standards)

    Args:
        df (pd.DataFrame): Cleaned dataframe

    Returns:
        dict: Trip information in Indian units (km, km/l, liters)
    """
    def safe_value(column_name: str, *, mode: str = 'last'):
        if column_name not in df.columns:
            return None
        series = df[column_name].dropna()
        if series.empty:
            return None
        if mode == 'mean':
            return series.mean()
        if mode == 'max':
            return series.max()
        try:
            return series.iloc[-1]
        except Exception:
            return None

    distance_miles = safe_value('Distance travelled (miles)', mode='max')
    if distance_miles is None:
        distance_miles = safe_value('Distance travelled (trip) (miles)', mode='max')
    distance_miles = float(distance_miles or 0)
    distance_km = distance_miles * 1.60934

    duration_minutes = 0
    if 'time' in df.columns:
        time_series = df['time'].dropna()
        if not time_series.empty:
            try:
                duration_minutes = int((time_series.iloc[-1] - time_series.iloc[0]).total_seconds() / 60)
            except Exception:
                duration_minutes = 0

    avg_mpg = safe_value('Average fuel consumption (total) (MPG)', mode='last')
    if avg_mpg is None:
        avg_mpg = safe_value('Average fuel consumption (MPG)', mode='mean')
    if avg_mpg is None:
        avg_mpg = 0
    avg_kmpl = float(avg_mpg) * 0.425144 if avg_mpg else 0

    avg_speed_mph = safe_value('Average speed (mph)', mode='last')
    if avg_speed_mph is None:
        avg_speed_mph = safe_value('Vehicle speed (mph)', mode='mean')
    if avg_speed_mph is None:
        avg_speed_mph = 0
    avg_speed_kmh = float(avg_speed_mph) * 1.60934 if avg_speed_mph else 0

    fuel_gallons = safe_value('Fuel used (gallon)', mode='last')
    if fuel_gallons is None:
        fuel_gallons = safe_value('Fuel used (total) (gallon)', mode='last')
    if fuel_gallons is None:
        fuel_gallons = safe_value('Fuel used (trip) (gallon)', mode='max')
    if fuel_gallons is None:
        fuel_gallons = 0
    fuel_liters = float(fuel_gallons) * 3.78541 if fuel_gallons else 0

    return {
        'distance_miles': round(distance_miles, 2),
        'distance_km': round(distance_km, 2),
        'duration_minutes': duration_minutes,
        'avg_mpg': round(float(avg_mpg), 2) if avg_mpg else 0,
        'avg_kmpl': round(avg_kmpl, 2) if avg_kmpl else 0,
        'avg_speed_mph': round(float(avg_speed_mph), 2) if avg_speed_mph else 0,
        'avg_speed_kmh': round(avg_speed_kmh, 2) if avg_speed_kmh else 0,
        'fuel_consumed_gallons': round(float(fuel_gallons), 2) if fuel_gallons else 0,
        'fuel_consumed_liters': round(fuel_liters, 2) if fuel_liters else 0
    }


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

    fig = Figure(figsize=(8, 5))
    ax = fig.subplots()

    ax.set_xlabel('Time')
    ax.set_ylabel('Engine RPM (rpm)')
    ax.plot(x, y, color='#2563eb', linewidth=1.8)
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%H:%M'))

    idling = 1000
    high_revs = 5000
    ideal_rpm = 2500

    ymin = float(y.min())
    ymax = float(y.max())
    ax.axhline(y=idling, color='#ea580c', linestyle='--', linewidth=1)
    ax.axhline(y=ideal_rpm, color='#16a34a', linestyle='--', linewidth=1)
    ax.axhline(y=high_revs, color='#dc2626', linestyle='--', linewidth=1)

    ax.axhspan(ymin, idling, facecolor='#fed7aa', alpha=0.35)
    ax.axhspan(idling, high_revs, facecolor='#bbf7d0', alpha=0.35)
    ax.axhspan(high_revs, ymax, facecolor='#fecaca', alpha=0.35)

    ax.grid(True, alpha=0.3)

    return generate_image(fig)


def plot_ideal_speed(x: pd.Series, y: pd.Series) -> str:
    """Plot vehicle speed over time with speed zones (rendered in km/h)

    Args:
        x (pd.Series): Time series
        y (pd.Series): Vehicle speed in mph (converted to km/h for the chart)

    Returns:
        str: Base64 encoded image
    """
    if y.empty or y.isna().all():
        return generate_empty_chart("No speed data available")

    speed_kmh = y.astype(float) * 1.60934

    fig = Figure(figsize=(8, 5))
    ax = fig.subplots()

    ax.set_xlabel('Time')
    ax.set_ylabel('Vehicle speed (km/h)')
    ax.plot(x, speed_kmh, color='#0ea5e9', linewidth=1.8)
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%H:%M'))

    ideal_speed = 80  # Approx. 50 mph expressed in km/h
    ymax = float(speed_kmh.max())
    ax.axhline(y=ideal_speed, color='#16a34a', linestyle='--', linewidth=1)
    ax.axhspan(0, ideal_speed, facecolor='#bbf7d0', alpha=0.35)
    if ymax > ideal_speed:
        ax.axhspan(ideal_speed, ymax, facecolor='#fecaca', alpha=0.35)
    ax.grid(True, alpha=0.3)

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

    fig = Figure(figsize=(8, 5))
    ax = fig.subplots()

    ax.set_xlabel('Time')
    ax.set_ylabel('Vehicle acceleration (g)')
    ax.scatter(x, y, s=8, c='#6366f1', alpha=0.7)
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%H:%M'))

    coasting = 0
    ymin = float(y.min())
    ymax = float(y.max())
    ax.axhline(y=coasting, color='#94a3b8', linestyle='--', linewidth=1)
    ax.axhspan(ymin, coasting - 0.1, facecolor='#fecaca', alpha=0.35)
    ax.axhspan(coasting - 0.1, coasting + 0.1, facecolor='#bbf7d0', alpha=0.35)
    ax.axhspan(coasting + 0.1, ymax, facecolor='#fed7aa', alpha=0.35)
    ax.grid(True, alpha=0.3)

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

    fig = Figure(figsize=(8, 7))
    ax = fig.subplots()

    hexbin = ax.hexbin(x, y, gridsize=18, cmap='YlOrRd', mincnt=1)
    ax.set_xlabel('Engine RPM (rpm)')
    ax.set_ylabel('Throttle Position (%)')
    ax.grid(True, alpha=0.25)

    cb = fig.colorbar(hexbin, ax=ax)
    cb.set_label('Frequency')

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
    fig = Figure(figsize=(8, 5))
    ax = fig.subplots()
    ax.text(0.5, 0.5, message, ha='center', va='center', fontsize=14, color='gray')
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    return generate_image(fig)
