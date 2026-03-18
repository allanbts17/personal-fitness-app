const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Ruta al archivo de clave de servicio (serviceAccountKey.json)
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('\n❌ ERROR: Falta el archivo "serviceAccountKey.json" en la carpeta "scripts".');
  console.error('Para obtenerlo:');
  console.error('1. Ve a la consola de Firebase -> Configuración del proyecto -> Cuentas de servicio.');
  console.error('2. Genera una nueva clave privada.');
  console.error('3. Renombra el archivo descargado a "serviceAccountKey.json" y ponlo en la carpeta "scripts/".\n');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

async function deleteAllUsers() {
  try {
    console.log('\n--- Iniciando la purga total de usuarios ---');

    /* -------------------------------------------------------------
       1. BORRAR DE FIREBASE AUTHENTICATION
       ------------------------------------------------------------- */
    console.log('\n[1] Consultando Firebase Authentication...');
    let result = await auth.listUsers(1000);
    let authUids = result.users.map(user => user.uid);
    
    while(result.pageToken) {
        result = await auth.listUsers(1000, result.pageToken);
        authUids = authUids.concat(result.users.map(user => user.uid));
    }

    if (authUids.length > 0) {
      console.log(`-> Se encontraron ${authUids.length} usuarios en Auth. Procediendo a borrar...`);
      const deleteResult = await auth.deleteUsers(authUids);
      
      console.log(`   ✔️ Borrados con éxito: ${deleteResult.successCount}`);
      if (deleteResult.failureCount > 0) {
        console.log(`   ❌ Errores al borrar: ${deleteResult.failureCount}`);
        deleteResult.errors.forEach((err) => {
          console.log(`      - Error en uid ${authUids[err.index]}:`, err.error.message);
        });
      }
    } else {
      console.log('-> No hay usuarios en Firebase Authentication.');
    }

    /* -------------------------------------------------------------
       2. BORRAR DE FIRESTORE (Colección 'users')
       ------------------------------------------------------------- */
    console.log('\n[2] Consultando la colección "users" en Firestore...');
    const usersSnapshot = await db.collection('users').get();
    
    if (!usersSnapshot.empty) {
      console.log(`-> Se encontraron ${usersSnapshot.size} documentos en Firestore. Procediendo a borrar...`);
      
      let batch = db.batch();
      let count = 0;
      let totalDeleted = 0;

      for (const doc of usersSnapshot.docs) {
        batch.delete(doc.ref);
        count++;
        
        // Firestore limita los batch a 500 operaciones
        if (count === 500) {
          await batch.commit();
          totalDeleted += count;
          console.log(`   ... ${totalDeleted} documentos borrados ...`);
          batch = db.batch(); // Iniciar un nuevo batch
          count = 0;
        }
      }

      // Commit para los restantes (menos de 500)
      if (count > 0) {
        await batch.commit();
        totalDeleted += count;
      }
      
      console.log(`   ✔️ Total de documentos "users" borrados de Firestore: ${totalDeleted}`);
    } else {
      console.log('-> La colección "users" en Firestore ya está vacía.');
    }

    console.log('\n--- ✅ Proceso completado exitosamente ---\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Ocurrió un error inesperado:', error);
    process.exit(1);
  }
}

deleteAllUsers();
