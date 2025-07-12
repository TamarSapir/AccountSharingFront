import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f0fa',
  },
  topContainer: {
    backgroundColor: '#3498db',
    height: '35%',
    borderBottomRightRadius: 60,
    borderBottomLeftRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleText: {
    textAlign: 'center',
    color: '#555',
  },
  linkText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  background: {
  flex: 1,
  width: '100%',
  height: '100%',
},

overlay: {
  flex: 1,
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
},
});

export default styles;