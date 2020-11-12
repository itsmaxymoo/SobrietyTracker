package io.itsmaxymoo.sobrietytracker

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.webkit.WebView

class MainActivity : AppCompatActivity() {
	override fun onCreate(savedInstanceState: Bundle?) {
		super.onCreate(savedInstanceState)
		setContentView(R.layout.activity_main)

		val w: WebView = findViewById(R.id.webViewMain)
		w.settings.apply {
			javaScriptEnabled = true
			domStorageEnabled = true
			allowFileAccess = true
		}

		w.loadUrl("file:///android_asset/index.html")
	}
}