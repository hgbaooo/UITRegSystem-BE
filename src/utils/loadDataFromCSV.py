import pandas as pd

def load_data_from_csv(file_path):
    try:
        df = pd.read_csv(file_path)
        return df
    except Exception as e:
        print(f"Error loading CSV file: {e}")
        raise

if __name__ == '__main__':
    csv_path = '../data_regulation.csv'
    data = load_data_from_csv(csv_path)
    print(data.head())