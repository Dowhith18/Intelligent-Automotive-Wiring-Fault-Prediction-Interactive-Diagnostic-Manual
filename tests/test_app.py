import io
import os
import pytest

from app import app as flask_app, dtc_data


@pytest.fixture()
def client():
    flask_app.config['TESTING'] = True
    with flask_app.test_client() as client:
        yield client


@pytest.fixture()
def authenticated_client(client):
    response = client.post('/login', data={
        'username': 'admin',
        'password': 'admin123'
    }, follow_redirects=True)
    assert response.status_code in (200, 302)
    return client


def test_login_page_accessible(client):
    response = client.get('/login')
    assert response.status_code == 200


def test_login_rejects_invalid_credentials(client):
    response = client.post('/login', data={
        'username': 'admin',
        'password': 'wrongpassword'
    }, follow_redirects=True)
    assert response.status_code == 200
    assert b'Invalid username or password' in response.data


def test_index_requires_login(client):
    response = client.get('/')
    assert response.status_code == 302
    assert response.headers['Location'].endswith('/login')

def test_analysis_requires_login(client):
    response = client.get('/analysis')
    assert response.status_code == 302
    assert response.headers['Location'].endswith('/login')


def test_authenticated_views(authenticated_client):
    for path in ('/', '/vehicle', '/dtc-lookup', '/analysis'):
        response = authenticated_client.get(path)
        assert response.status_code == 200

    sample_code = next(iter(dtc_data))
    response = authenticated_client.get(f'/dtc/{sample_code}')
    assert response.status_code == 200


def test_upload_diagnostic_data(authenticated_client):
    tests_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(tests_dir)
    sample_path = os.path.join(project_root, 'instance', 'demo', 'grocery-run.csv')
    assert os.path.exists(sample_path)

    with open(sample_path, 'rb') as sample_file:
        file_bytes = io.BytesIO(sample_file.read())

    data = {
        'csv_files': (file_bytes, 'grocery-run.csv')
    }

    response = authenticated_client.post(
        '/upload-diagnostic-data',
        data=data,
        content_type='multipart/form-data'
    )

    assert response.status_code == 200
    payload = response.get_json()
    assert payload and payload.get('success') is True
    assert payload.get('files')


def test_upload_requires_authentication(client):
    response = client.post('/upload-diagnostic-data')
    assert response.status_code == 401


def test_upload_without_file(authenticated_client):
    response = authenticated_client.post('/upload-diagnostic-data', data={}, content_type='multipart/form-data')
    assert response.status_code == 400
    payload = response.get_json()
    assert payload.get('error')


def test_trip_dashboard_missing_file(authenticated_client):
    response = authenticated_client.get('/trip-dashboard/not-a-real-trip.csv')
    assert response.status_code == 404


def test_trip_dashboard_requires_login(client):
    response = client.get('/trip-dashboard/some-file.csv')
    assert response.status_code == 302
    assert response.headers['Location'].endswith('/login')
