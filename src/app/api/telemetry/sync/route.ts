
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, doc, writeBatch, serverTimestamp } from 'firebase/firestore';

/**
 * @fileOverview Batch telemetry sync endpoint for mobile agents.
 * Accepts arrays of Calls, SMS, and Usage logs.
 */

export async function POST(request: Request) {
  try {
    const { deviceId, calls, sms, usage } = await request.json();
    const { firestore } = initializeFirebase();
    
    if (!deviceId) return NextResponse.json({ error: 'Missing deviceId' }, { status: 400 });

    const batch = writeBatch(firestore);

    // Sync Calls
    calls?.forEach((call: any) => {
      const ref = doc(collection(firestore, 'devices', deviceId, 'calls'));
      batch.set(ref, { ...call, syncedAt: serverTimestamp() });
    });

    // Sync SMS
    sms?.forEach((msg: any) => {
      const ref = doc(collection(firestore, 'devices', deviceId, 'sms'));
      batch.set(ref, { ...msg, syncedAt: serverTimestamp() });
    });

    // Sync App Usage
    usage?.forEach((item: any) => {
      const ref = doc(collection(firestore, 'devices', deviceId, 'usage'));
      batch.set(ref, { ...item, syncedAt: serverTimestamp() });
    });

    await batch.commit();

    return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
